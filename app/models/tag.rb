# TODO: Test all error messages nad translate them.
class Tag < Sequel::Model
  #########
  # Plugins
  #########

  plugin :validation_helpers
  plugin :translated_validation_messages
  plugin :defaults_setter
  plugin :eager_each

  ##############
  # Associations
  ##############

  many_to_many :entries, join_table: :taggings

  ###############
  # Class methods
  ###############

  class << self
    def most_used_combinations
      nakup   = Tag.first(name: 'Nákup')
      kavarna = Tag.first(name: 'Kavárna')
      auto    = Tag.first(name: 'Auto')
      leky    = Tag.first(name: 'Léky')
      benzin  = Tag.first(name: 'Benzín')
      servis  = Tag.first(name: 'Servis')

      prevodem = Tag.first(name: 'Převodem')
      kartou   = Tag.first(name: 'Kartou')
      csob     = Tag.first(name: 'ČSOB')
      kb       = Tag.first(name: 'KB')
      revolut  = Tag.first(name: 'Revolut')
      cash     = Tag.first(name: 'Cash')

      groups = [
        [nakup, kartou, csob],
        [nakup, kartou, kb],
        [nakup, kartou, revolut],
        [kavarna, kartou, csob],
        [kavarna, kartou, kb],
        [kavarna, kartou, revolut],
        [leky, kartou, csob],
        [leky, kartou, kb],
        [auto, benzin, kartou, kb],
        [auto, servis, prevodem, kb],
        [auto, cash]
      ].map do |group|
        next if group.any?(&:nil?)
        group
      end.compact

      groups.each { |group| group.sort! { |a, b| a.position <=> b.position } }
    end

    def data_for_chart(tag_id:, date:, sort_by:)
      sort_by ||= :accounted_on

      ds = Tag.with_pk!(tag_id).entries_dataset
      to = Date.new(date.year, date.month, -1)
      ds.where(Sequel.lit('COALESCE(:column, current_date) <= :to', column: sort_by, to: to))
      ds = ds.select(Sequel.lit('sum(amount)').as(:amount), Sequel.lit("date_trunc('month', COALESCE(:column, current_date))::date", column: sort_by).as(:year_month))

      incomes  = ds.where(Sequel.lit('amount >= 0')).group(:year_month).order(:year_month).all
      expenses = ds.where(Sequel.lit('amount < 0')).group(:year_month).order(:year_month).all

      start_date = [(incomes.first && incomes.first[:year_month]), (expenses.first && expenses.first[:year_month])].compact.min

      return [] unless start_date

      end_date = Date.new(date.year, date.month, 1)

      date = start_date
      data = []

      loop do
        item_incomes =
          if incomes.first && incomes.first[:year_month] == date
            incomes.shift[:amount]
          else
            0.to_d
          end

        item_expenses =
          if expenses.first && expenses.first[:year_month] == date
           expenses.shift[:amount]
          else
            0.to_d
          end

        item_total = item_incomes + item_expenses

        item = {
          date:     date,
          total:    item_total,
          incomes:  item_incomes,
          expenses: -item_expenses
        }

        data << item

        break if date == end_date

        date = date.next_month
      end

      if data.all? { |i| i[:incomes] == 0 }
        data.each do |i|
          i.delete(:total)
          i.delete(:incomes)
        end
      end

      if data.all? { |i| i[:expenses] == 0 }
        data.each do |i|
          i.delete(:total)
          i.delete(:expenses)
        end
      end

      data
    end
  end

  #################
  # Dataset methods
  #################

  dataset_module do
    def ordered
      order(:position)
    end
  end

  #############
  # Validations
  #############

  def validate
    super

    validates_presence [
      :name
    ]

    validates_unique :name
    validates_exact_length 7, :color, allow_nil: true
  end

  ###########
  # Callbacks
  ###########

  def before_validation
    # Hack to circumvent the fact that input type color cannot be empty.
    self.color = nil if color == '#000000'

    super
  end

  def before_create
    self.position ||= begin
      (model.ordered.select(:position).last&.position || 0) + 1
    end

    super
  end

  #########################
  # Public instance methods
  #########################

  def dark?
    return @is_dark if defined?(@is_dark)
    return @is_dark = false unless color
    parts = color.delete('#').scan(/.{2}/).map { |s| s.to_i(16) }
    @is_dark = parts.reduce(:+) < 255 * 2
  end

  def light?
    return @is_light if defined?(@is_light)
    return @is_light = false unless color
    @is_light = !dark?
  end
end