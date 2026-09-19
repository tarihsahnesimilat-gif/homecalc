import type { CalculatorFaq } from './calculator-content/types.ts'
import type { CalculatorCategoryId } from './calculators.ts'

/**
 * Editorial content for the category pages.
 *
 * A category page used to be a heading, one sentence and a grid of cards — no
 * reason for anyone to read it and nothing for a search engine or an ad network
 * reviewer to judge it on. This file gives each category a written section
 * explaining what the tools are for, which one answers which question, how to
 * read a result and what people get wrong.
 *
 * It mirrors `lib/calculator-content/` deliberately: content lives in code, one
 * typed object per page, so everything is statically rendered and indexable and
 * nothing here executes. Calculation logic stays in `lib/calculations/`.
 */

/** A "which one do I need?" entry. `slug` must be a live calculator. */
export interface CategoryGuideItem {
  slug: string
  /** When to reach for it, in the user's terms rather than the tool's. */
  text: string
}

export interface CategoryMistake {
  title: string
  description: string
}

export interface CategoryContent {
  id: CalculatorCategoryId
  overview: { title: string; paragraphs: string[] }
  chooser: { title: string; items: CategoryGuideItem[] }
  interpreting: { title: string; paragraphs: string[] }
  mistakes: { title: string; items: CategoryMistake[] }
  faqs: CalculatorFaq[]
  /**
   * Shown below the editorial content. Present on the categories where a
   * reader could otherwise mistake an arithmetic result for advice.
   */
  disclaimer?: string
}

const math: CategoryContent = {
  id: 'math',
  overview: {
    title: 'What these math calculators are for',
    paragraphs: [
      'Most everyday arithmetic is not difficult. It is just easy to get wrong in a hurry — at a checkout, halfway through a spreadsheet, or when a figure has to be turned into a percentage of something else. These tools cover the operations that come up most often outside a classroom: percentages in their various forms, fractions, ratios, averages, powers and roots, along with a full scientific calculator for anything heavier.',
      'They are built for single answers rather than long calculations. Each one shows the working alongside the result, so you can check that it answered the question you meant to ask. With percentages in particular that is where errors start: the arithmetic is rarely wrong, but the number it was measured against often is.',
    ],
  },
  chooser: {
    title: 'Which math calculator do I need?',
    items: [
      {
        slug: 'percentage-calculator',
        text: 'The general starting point — what a percentage of a number is, what one number is as a percentage of another, and increases or decreases from a single figure.',
      },
      {
        slug: 'percentage-change-calculator',
        text: 'Use this when one figure genuinely came before the other, such as last month against this month. The earlier figure is the base the change is measured from.',
      },
      {
        slug: 'percentage-difference-calculator',
        text: 'Use this when neither figure came first — two competing quotes, two readings. It compares them against their average instead of arbitrarily picking one as the base.',
      },
      {
        slug: 'percentage-point-calculator',
        text: 'For figures that are already percentages. A rate moving from 4% to 5% has risen one percentage point and also 25%, and mixing those up changes the story entirely.',
      },
      {
        slug: 'average-calculator',
        text: 'Mean, sum and count for a list of numbers — marks, meter readings, a month of expenses.',
      },
      {
        slug: 'fraction-calculator',
        text: 'Adding, subtracting, multiplying or dividing fractions, and reducing the answer, without converting to decimals and back.',
      },
      {
        slug: 'ratio-calculator',
        text: 'Scaling a ratio up or down while keeping the proportions — recipes, mixes, screen dimensions.',
      },
      {
        slug: 'scientific-calculator',
        text: 'Trigonometry, logarithms and bracketed expressions, when the question is longer than one operation.',
      },
    ],
  },
  interpreting: {
    title: 'Reading the results',
    paragraphs: [
      'Every result is exact arithmetic on the numbers you enter, which means the answer is only ever as good as the base you chose. 20 as a percentage of 50 is 40%, while 50 as a percentage of 20 is 250% — both correct, and answers to different questions. Before trusting a percentage, check which value it was measured against.',
      'Displayed figures are rounded for readability; the calculation behind them is not. If you are carrying a number into a further step, work from the fuller figure rather than the rounded one on screen, because small roundings compound quickly across several steps.',
    ],
  },
  mistakes: {
    title: 'Common mistakes to avoid',
    items: [
      {
        title: 'Averaging percentages directly',
        description:
          'The average of 50% and 100% is 75% only if both were measured on groups of the same size. Add up the underlying amounts first, then work out the percentage from those totals.',
      },
      {
        title: 'Assuming a percentage reverses itself',
        description:
          'Taking 20% off a price that has just had 20% added does not return the original. The second 20% is taken from a larger number, so you land about 4% below where you started.',
      },
      {
        title: 'Confusing percent with percentage points',
        description:
          'Interest, tax and approval rates are all quoted as percentages, so a move from 4% to 6% is two percentage points — not two percent, which would be a move to 4.08%.',
      },
    ],
  },
  faqs: [
    {
      question: 'Should I use percentage change or percentage difference?',
      answer:
        'Percentage change when one value came first and the other followed, such as a before-and-after price. Percentage difference when the two values are simply two of a kind, like quotes from two suppliers, where naming either one as the starting point would be arbitrary.',
    },
    {
      question: 'Why does my percentage answer disagree with someone else’s?',
      answer:
        'Almost always because a different base was used. The same pair of numbers gives a different percentage depending on which one is treated as the whole, so agree on that before comparing answers.',
    },
    {
      question: 'Are the results rounded?',
      answer:
        'The displayed figures are rounded to a sensible number of decimal places; the calculation itself runs at full precision. For multi-step work, keep the unrounded value between steps and round only at the end.',
    },
    {
      question: 'Do I need the scientific calculator for basic percentages?',
      answer:
        'No. The dedicated percentage tools lay out the question in words, which makes it far harder to solve the wrong one. The scientific calculator is for expressions — brackets, powers, trigonometry — rather than single conversions.',
    },
  ],
}

const finance: CategoryContent = {
  id: 'finance',
  overview: {
    title: 'What these financial calculators are for',
    paragraphs: [
      'Money questions tend to fall into three groups: what something will cost you, what it might earn, and what a price leaves you with. This category covers all three — repayments and interest on borrowing, growth on savings and investments, and the everyday arithmetic of tips, discounts, sales tax, margin and commission.',
      'Every calculator works from figures you supply rather than from live lender or market data. That makes them comparison tools rather than quotes: they answer "what happens if these numbers hold", which is exactly what you need when weighing two options. Run the same scenario twice with one input changed, and the gap between the results is the thing you are actually deciding about.',
    ],
  },
  chooser: {
    title: 'Which financial calculator do I need?',
    items: [
      {
        slug: 'loan-payment-calculator',
        text: 'Start here for anything borrowed and repaid in fixed instalments — a car loan, a personal loan. It turns an amount, a rate and a term into a monthly payment.',
      },
      {
        slug: 'mortgage-calculator',
        text: 'The same arithmetic over a much longer term, where a small difference in rate compounds into a large difference in total cost.',
      },
      {
        slug: 'loan-interest-calculator',
        text: 'When the question is what the borrowing costs in total rather than what it costs each month.',
      },
      {
        slug: 'compound-interest-calculator',
        text: 'For anything that earns on its own earnings. Use the simple interest calculator instead where interest is charged only on the original amount.',
      },
      {
        slug: 'savings-calculator',
        text: 'For a balance you keep adding to, where regular contributions do more of the work than the interest rate does.',
      },
      {
        slug: 'debt-payoff-calculator',
        text: 'To see how long a balance takes to clear at a given payment, and what paying a little more each month does to that.',
      },
      {
        slug: 'profit-margin-calculator',
        text: 'Margin is the share of the selling price you keep. Markup, in the markup calculator, is what you added to your cost — a 50% markup is a 33% margin.',
      },
      {
        slug: 'break-even-calculator',
        text: 'For a business question rather than a personal one: how many units cover the fixed costs before anything counts as profit.',
      },
    ],
  },
  interpreting: {
    title: 'Reading the results',
    paragraphs: [
      'Each result is a projection from the assumptions you entered, not an offer. A real loan carries fees, insurance and early-repayment terms that a payment formula does not model, and a real investment return arrives unevenly rather than as the same percentage every year. The further out a projection runs, the more of its final digits are noise.',
      'The useful move is comparison, not prediction. Change only the interest rate and re-read the result, then change only the term: how much each one moves the answer tells you which assumption deserves the most scrutiny before you commit to anything.',
    ],
  },
  mistakes: {
    title: 'Common mistakes to avoid',
    items: [
      {
        title: 'Mixing annual and monthly figures',
        description:
          'Rates are normally quoted per year while terms are often entered in months. Check what each field expects before comparing two results, because a rate entered as a monthly figure produces an answer that looks plausible and is twelvefold wrong.',
      },
      {
        title: 'Treating markup as margin',
        description:
          'They are different fractions of different numbers. Pricing from a target margin using a markup percentage quietly undercharges on every sale.',
      },
      {
        title: 'Leaving fees out of the comparison',
        description:
          'Arrangement fees, account charges and insurance sit outside the repayment formula but land in your account all the same. Compare the total cost of two offers, not just their monthly payments.',
      },
    ],
  },
  faqs: [
    {
      question: 'Do these calculators use live interest or exchange rates?',
      answer:
        'No. You supply every rate, which is why the results stay accurate as markets move. The currency converter works the same way: you enter a rate from your bank or a live quote and it does the conversion.',
    },
    {
      question: 'Why does my lender quote a different monthly payment?',
      answer:
        'Lenders add fees to the balance, round in their own way, and may use a different day-count convention or charge interest from a different start date. The formula here gives the underlying arithmetic; the offer document gives the contract.',
    },
    {
      question: 'Should I use simple or compound interest?',
      answer:
        'Compound interest for savings, investments and most credit balances, where interest is added to the balance and then earns or costs interest itself. Simple interest for arrangements that explicitly charge only on the original principal, which is rarer than people expect.',
    },
    {
      question: 'Is a 50% markup the same as a 50% margin?',
      answer:
        'No. Markup is measured against your cost, margin against your selling price. Cost 100, sell 150: that is a 50% markup and a 33.3% margin.',
    },
    {
      question: 'Can I make a financial decision from these numbers?',
      answer:
        'They are a good way to understand how the moving parts interact and to compare options on the same basis. They are not a substitute for the actual terms of a product or for advice from someone who knows your circumstances.',
    },
  ],
  disclaimer:
    'These calculators are informational tools. They do not know your circumstances and are not financial, tax, legal or investment advice. Every figure is an estimate based on what you enter — check anything that matters with your lender, provider or a qualified adviser before acting on it.',
}

const health: CategoryContent = {
  id: 'health',
  overview: {
    title: 'What these health calculators are for',
    paragraphs: [
      'These tools turn measurements you already have into figures that are easier to track and compare: body mass index from height and weight, basal metabolic rate and estimated daily energy needs, the arithmetic of an energy deficit, and running pace from a distance and a time.',
      'All of them are population formulas. They were produced by fitting equations to data from large groups, so they describe an average person with your inputs rather than you specifically. Body composition, genetics, medication, sleep and health conditions all shift the real figure, and none of them appear anywhere in the formula. That is a limit of the method, not a flaw in the calculation.',
    ],
  },
  chooser: {
    title: 'Which health calculator do I need?',
    items: [
      {
        slug: 'bmi-calculator',
        text: 'A single screening number from height and weight, with the standard adult category it falls in. Quick to track over time; not a measure of body composition.',
      },
      {
        slug: 'bmr-calculator',
        text: 'The energy your body uses at complete rest, before any activity is counted. It is the base figure every daily estimate is built on.',
      },
      {
        slug: 'calorie-calculator',
        text: 'Basal rate multiplied by an activity level, giving an estimate of total daily energy needs — the figure people usually mean by "maintenance".',
      },
      {
        slug: 'calorie-deficit-calculator',
        text: 'What a given daily shortfall works out to over weeks. Useful for seeing how modest a realistic rate of change looks on paper.',
      },
      {
        slug: 'pace-calculator',
        text: 'Not a body measurement at all: pace per kilometre or mile from a distance and a time, plus the equivalent speed.',
      },
    ],
  },
  interpreting: {
    title: 'Reading the results',
    paragraphs: [
      'Treat every number here as a range rather than a reading. An estimate of daily energy needs can sit a few hundred calories either side of reality for a perfectly ordinary person, and the BMI categories are agreed conventions — nothing about your health changes at the moment a figure crosses 25.',
      'What these estimates are genuinely good at is showing direction. Recalculated the same way every few weeks, the error in the method stays roughly constant while the change does not, so the trend carries real information even when a single result does not. Never compare a figure from here against one from a site using a different equation, and never read a category as a diagnosis.',
    ],
  },
  mistakes: {
    title: 'Common mistakes to avoid',
    items: [
      {
        title: 'Mixing units mid-entry',
        description:
          'Height in centimetres with weight in pounds produces a number rather than an error. Set the unit system first and keep every field in it.',
      },
      {
        title: 'Comparing estimates from different formulas',
        description:
          'Several accepted equations exist for basal metabolic rate and they disagree by a hundred calories or more on the same person. A difference between two sites is usually a difference between two formulas, not new information about you.',
      },
      {
        title: 'Treating an estimate as a target',
        description:
          'A calculated figure is a starting hypothesis to check against what actually happens over a few weeks, not an instruction. Anyone planning a meaningful change to how they eat or train should discuss it with a qualified professional first.',
      },
    ],
  },
  faqs: [
    {
      question: 'Is BMI accurate for athletes or very muscular people?',
      answer:
        'Often not. BMI compares weight to height and cannot tell muscle from fat, so a muscular person can land in a category that says little about their health. It was designed to describe populations, and it works better there than on individuals.',
    },
    {
      question: 'What is the difference between BMR and daily calorie needs?',
      answer:
        'Basal metabolic rate is what your body uses at complete rest. Daily needs take that figure and apply an activity multiplier for everything you do on top, which is why the second number is always the larger one.',
    },
    {
      question: 'Why does another site give me a different BMR?',
      answer:
        'Different equations. Mifflin-St Jeor, Harris-Benedict and Katch-McArdle all take slightly different inputs and return slightly different answers for the same person. Pick one method and stay with it if you want the numbers to be comparable over time.',
    },
    {
      question: 'Are these calculators suitable for children or during pregnancy?',
      answer:
        'No. They use adult formulas and adult reference ranges. Children are assessed against age-and-sex percentile charts instead, and energy needs in pregnancy are a clinical question — both belong with a healthcare professional.',
    },
    {
      question: 'How large should a calorie deficit be?',
      answer:
        'That depends on your size, health, activity and goals, which is exactly the kind of judgement a formula cannot make. The deficit calculator shows the arithmetic of whatever figure you enter; how big it ought to be is a conversation to have with a qualified professional.',
    },
  ],
  disclaimer:
    'These calculators are informational and general. They are not medical advice, cannot assess your health, and are not a substitute for a qualified healthcare professional who knows your history. Speak to one before making significant changes to how you eat, train or manage a condition — and particularly if you are pregnant, under 18, or recovering from illness.',
}

const home: CategoryContent = {
  id: 'home',
  overview: {
    title: 'What these home and living calculators are for',
    paragraphs: [
      'Home projects go wrong at the ordering stage more often than at the doing stage. Almost every material that covers a surface or fills a space is sold by area or by volume, while rooms come measured in lengths and widths — and suppliers quote in whichever unit suits them rather than the one on your tape measure.',
      'This category is about closing that gap: working out how much of something a space needs, in the unit the supplier actually sells it in, before any money is spent. Measure twice, calculate once, and add a waste margin deliberately rather than discovering you needed one halfway through a floor.',
    ],
  },
  chooser: {
    title: 'Which calculator do I need for a home project?',
    items: [
      {
        slug: 'area-calculator',
        text: 'Square footage or square metres for a room, a wall or a plot, from a rectangle, circle or triangle — the figure flooring, turf, tiles and paint are all ordered against.',
      },
      {
        slug: 'concrete-calculator',
        text: 'Volume rather than area, for a slab, footing or base: the same measurement with a depth added, converted to the cubic yards or cubic metres a supplier quotes. It is filed under Everyday Tools.',
      },
      {
        slug: 'unit-converter',
        text: 'When the plan is in metres and the product is sold in feet, or a specification mixes the two.',
      },
      {
        slug: 'price-per-unit-calculator',
        text: 'For choosing between two materials sold in different pack sizes, where the cheaper box is not always the cheaper floor.',
      },
    ],
  },
  interpreting: {
    title: 'Reading the results',
    paragraphs: [
      'A result is the geometry of the numbers you entered and nothing more. It assumes flat, square surfaces and makes no allowance for cuts, offcuts, pattern matching or the piece you ruin — so treat it as the minimum you need rather than the amount to order. Around 10% extra is a common allowance for flooring and tiling, and more for a diagonal layout or a repeating pattern; your supplier or fitter will know the right figure for the material.',
      'Watch squared and cubed units above everything else. A square yard is nine square feet, not three, and a cubic yard is twenty-seven cubic feet — squaring or cubing a unit does the same to its conversion factor. That single misunderstanding is the most expensive mistake in this category, because it is wrong by a multiple rather than a few percent.',
    ],
  },
  mistakes: {
    title: 'Common mistakes to avoid',
    items: [
      {
        title: 'Entering mixed units in one field',
        description:
          'A room that is "twelve foot six" is 12.5 feet, not 12.6. Convert inches to a decimal of a foot, or work in inches throughout, before anything goes into a box.',
      },
      {
        title: 'Treating an irregular room as one rectangle',
        description:
          'Split an L-shaped space into two rectangles, calculate each and add them. A bay is usually a rectangle plus part of a circle. Squeezing an odd shape into one measurement always under-orders.',
      },
      {
        title: 'Rounding up at every step',
        description:
          'Generous rounding on each measurement, then again on the order, stacks up into materials you pay to store. Round once, at the end, after the waste allowance is added.',
      },
    ],
  },
  faqs: [
    {
      question: 'How do I work out the square footage of an irregular room?',
      answer:
        'Divide it into shapes the calculator handles — usually rectangles — measure each one, calculate them separately and add the areas together. Alcoves and chimney breasts are small rectangles you subtract the same way.',
    },
    {
      question: 'How much extra should I order for waste?',
      answer:
        'Enough to cover cuts and mistakes, which depends on the material and the layout rather than on the room. Roughly 10% is a common starting point for flooring and tiles, less for paint, more for diagonal or patterned installations. Confirm it with whoever is supplying or fitting the material.',
    },
    {
      question: 'Do I subtract doorways and windows?',
      answer:
        'For paint, yes — they are surface you will not cover, and large windows make a real difference. For flooring, most people do not, because the offcuts rarely tile back together neatly and the margin is useful anyway.',
    },
    {
      question: 'Why is my supplier’s quantity different from my calculated area?',
      answer:
        'Materials come in fixed pack sizes, so any real order rounds up to whole boxes, and suppliers add their own waste allowance on top. The calculated area is the surface to cover; the order is what it takes to cover it.',
    },
  ],
}

const dateTime: CategoryContent = {
  id: 'date-time',
  overview: {
    title: 'What these date and time calculators are for',
    paragraphs: [
      'Dates are what people most often get wrong by hand, because none of the units are uniform. Months run from 28 to 31 days, a leap year arrives every four years except when it does not, and an hour can go missing or repeat itself when the clocks change. Counting on your fingers across a month boundary works right up until it quietly does not.',
      'The calculators here apply those rules for you: an exact age, the gap between two dates in years, months and days, a plain count of days, a date a set period before or after another, durations between clock times, timesheet totals, and conversion between time zones on a specific date.',
    ],
  },
  chooser: {
    title: 'Which date or time calculator do I need?',
    items: [
      {
        slug: 'age-calculator',
        text: 'An exact age in years, months and days from a date of birth, plus the next birthday.',
      },
      {
        slug: 'date-difference-calculator',
        text: 'The gap between any two dates expressed the way people talk about it — two years, three months, four days.',
      },
      {
        slug: 'days-between-dates-calculator',
        text: 'The same gap as a single number of days, which is what notice periods, deadlines and interest calculations actually run on.',
      },
      {
        slug: 'date-calculator',
        text: 'For adding or subtracting a period: what date falls 90 days from now, or 12 weeks before a deadline.',
      },
      {
        slug: 'time-duration-calculator',
        text: 'How long there is between two clock times, including spans that cross midnight.',
      },
      {
        slug: 'work-hours-calculator',
        text: 'A single shift with an unpaid break deducted, giving both the gross and the net hours.',
      },
      {
        slug: 'hours-calculator',
        text: 'Several shifts totalled at once, with a decimal-hours figure because that is what payroll systems expect.',
      },
      {
        slug: 'time-zone-converter',
        text: 'A time in one zone expressed in another on a particular date, so whichever daylight saving rules applied that day are the ones used.',
      },
    ],
  },
  interpreting: {
    title: 'Reading the results',
    paragraphs: [
      'A gap in years and months is not a fixed number of days, because "one month" is anything from 28 to 31 depending on where it starts. The years-months-days answer and the plain day count are both correct and will not convert cleanly into one another — so use the day count whenever a deadline, a contract term or an interest period depends on it.',
      'Whether the first and last days count is a convention rather than a fact. Deadlines usually run from the day after the start; stays are counted in nights, which is one fewer than the days. Decide which convention your situation uses before reading the number, since that choice is where nearly every off-by-one comes from.',
    ],
  },
  mistakes: {
    title: 'Common mistakes to avoid',
    items: [
      {
        title: 'Assuming every month is 30 days',
        description:
          'Three months from 30 November is 28 February or 1 March depending on the rule applied, and no amount of arithmetic makes those the same day. Add months as months, or count days as days, but do not convert casually between them.',
      },
      {
        title: 'Reading days when you needed nights',
        description:
          'A trip from the 1st to the 5th is five days and four nights. Bookings, car hire and invoices do not all use the same one, so check which the count in front of you represents.',
      },
      {
        title: 'Writing decimal hours as minutes',
        description:
          'Seven and a half hours is 7:30 on a clock and 7.5 in a payroll field — never 7.50 minutes or 7:50. Timesheet totals show both forms so the wrong one is harder to copy across.',
      },
    ],
  },
  faqs: [
    {
      question: 'Do these calculators handle leap years?',
      answer:
        'Yes. Counting runs through the real calendar, so any 29 February inside a span is counted like any other day, and an age spanning several leap years comes out exactly.',
    },
    {
      question: 'Should I use the date difference or the days between calculator?',
      answer:
        'Date difference when you want the gap described in years, months and days. Days between when you want one number to work with — a notice period, a deadline, a count of nights. Both use the same calendar arithmetic and agree with each other.',
    },
    {
      question: 'How is daylight saving handled?',
      answer:
        'Time zone conversion uses the date you enter, so the rules actually in force that day are the ones applied. It is worth converting rather than assuming during the few weeks each year when countries have already switched and others have not.',
    },
    {
      question: 'Can a shift that crosses midnight be calculated?',
      answer:
        'Yes. An end time earlier than the start rolls over into the next day, so 22:00 to 06:00 comes out as eight hours rather than as an error.',
    },
    {
      question: 'Why is my timesheet total different from my payslip?',
      answer:
        'Usually rounding rules or unpaid breaks. Many employers round each shift to the nearest five or fifteen minutes and deduct breaks by policy rather than by actual time taken, so a to-the-minute total can legitimately differ from what is paid.',
    },
  ],
}

const everyday: CategoryContent = {
  id: 'everyday',
  overview: {
    title: 'What these everyday calculators are for',
    paragraphs: [
      'These are the small calculations that sit between a decision and getting on with the day: whether the big box is really better value, what a drive will cost in fuel, how many litres a recipe in cups needs, how much concrete a base takes, what an amount comes to in another currency.',
      'None of them are difficult. What they have in common is units — the answer usually depends on getting two quantities into the same measure before comparing them, and that is precisely the step people skip when standing in an aisle or a builders’ merchant. Doing it on a page instead of in your head takes seconds and removes the factor-of-ten errors.',
    ],
  },
  chooser: {
    title: 'Which everyday calculator do I need?',
    items: [
      {
        slug: 'unit-converter',
        text: 'Length, weight, volume and temperature between metric and imperial, using the internationally agreed definitions rather than rules of thumb.',
      },
      {
        slug: 'price-per-unit-calculator',
        text: 'Reduces two pack sizes to a price per gram, sheet or litre, which is the only reliable way to tell which is actually cheaper.',
      },
      {
        slug: 'fuel-cost-calculator',
        text: 'What a trip costs, from a distance, a fuel price and an efficiency figure in miles per gallon, kilometres per litre or litres per 100 km.',
      },
      {
        slug: 'currency-converter',
        text: 'Converts an amount using an exchange rate you supply from a source you trust. It deliberately holds no rates of its own, since a stored rate goes stale within hours while still looking authoritative.',
      },
      {
        slug: 'concrete-calculator',
        text: 'Volume for a slab or base with a waste allowance, given in cubic yards, cubic feet and cubic metres at once.',
      },
    ],
  },
  interpreting: {
    title: 'Reading the results',
    paragraphs: [
      'These results are exact for the figures entered and approximate for the real world, and the gap is nearly always in the inputs. Manufacturer fuel efficiency comes from standardised tests that traffic, load and weather do not respect, so a real journey usually costs a little more. An exchange rate from a bank or card provider already carries a margin, and there may be a separate fee on top.',
      'Where a comparison is the point — two pack sizes, two materials — what matters is that both sides use the same unit. Cost per 100 g against cost per kilogram will produce a confident answer that is wrong by a factor of ten. Check the units first, then read the number.',
    ],
  },
  mistakes: {
    title: 'Common mistakes to avoid',
    items: [
      {
        title: 'Comparing prices in different units',
        description:
          'Per 500 g against per kilogram, or per sheet against per roll, looks like a comparison and is not one. Convert both to the same unit before deciding which is better value.',
      },
      {
        title: 'Assuming a gallon is a gallon',
        description:
          'The unit converter uses US liquid measures, where a gallon is 3.785 litres. An imperial gallon is about 4.546 litres — a 20% difference that matters when fuel costs or recipes are involved.',
      },
      {
        title: 'Expecting a stored exchange rate',
        description:
          'The currency converter asks you for a rate on purpose. Take it from your bank, your card provider or a live quote at the moment you need it, and budget slightly above the result for fees and spread.',
      },
    ],
  },
  faqs: [
    {
      question: 'Are gallons, pints and cups US or imperial?',
      answer:
        'US liquid measures: a gallon is 3.785411784 litres. If a recipe or a fuel price is quoted in imperial gallons, convert with that in mind — the two differ by roughly 20%.',
    },
    {
      question: 'Why does the currency converter not fetch live rates?',
      answer:
        'Because a rate built into a page would be wrong within hours while still looking official, which is worse than no rate at all. You supply the rate from a source you trust and the converter does the arithmetic, including the inverse rate as a sanity check.',
    },
    {
      question: 'Is the bigger pack always better value?',
      answer:
        'Usually, but not reliably. Promotions on small sizes, premium packaging on large ones and plainly inconsistent pricing reverse it often enough that checking the price per unit is worth the few seconds it takes.',
    },
    {
      question: 'Why is my real fuel cost higher than the estimate?',
      answer:
        'Published efficiency figures come from standardised test cycles. Traffic, terrain, speed, load, air conditioning and cold weather all increase consumption, so an estimate based on the official figure tends to sit below what a journey actually costs.',
    },
  ],
}

const byId: Readonly<Record<string, CategoryContent>> = {
  math,
  finance,
  health,
  home,
  'date-time': dateTime,
  everyday,
}

export const categoryContent: readonly CategoryContent[] = [
  math,
  finance,
  health,
  home,
  dateTime,
  everyday,
]

/** Undefined for a category that has no editorial content yet. */
export function getCategoryContent(id: CalculatorCategoryId): CategoryContent | undefined {
  return byId[id]
}
