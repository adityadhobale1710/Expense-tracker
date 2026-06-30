import Category from '../models/Category.js';
import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import Budget from '../models/Budget.js';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#f97316', type: 'expense' },
  { name: 'Transport', icon: '🚗', color: '#3b82f6', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#8b5cf6', type: 'expense' },
  { name: 'Health', icon: '🏥', color: '#22c55e', type: 'expense' },
  { name: 'Utilities', icon: '💡', color: '#eab308', type: 'expense' },
  { name: 'Rent', icon: '🏠', color: '#14b8a6', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#6366f1', type: 'expense' },
  { name: 'Other', icon: '📁', color: '#6b7280', type: 'expense' },
  { name: 'Salary', icon: '💼', color: '#22c55e', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#3b82f6', type: 'income' },
  { name: 'Investment', icon: '📈', color: '#f59e0b', type: 'income' },
  { name: 'Gift', icon: '🎁', color: '#ec4899', type: 'income' },
  { name: 'Other Income', icon: '💰', color: '#6366f1', type: 'income' },
];

// Helper to get relative date
const getRelativeDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(12, 0, 0, 0);
  return date;
};

export const seedDataForUser = async (userId) => {
  console.log(`🌱 Seeding mock raw data for user ${userId}...`);

  // 1. Clean existing transactions & budgets
  await Promise.all([
    Expense.deleteMany({ user: userId }),
    Income.deleteMany({ user: userId }),
    Budget.deleteMany({ user: userId }),
  ]);

  // 2. Check and ensure default categories exist for the user
  let userCats = await Category.find({ user: userId });
  if (userCats.length === 0) {
    const catsToInsert = DEFAULT_CATEGORIES.map((c) => ({ ...c, user: userId }));
    userCats = await Category.insertMany(catsToInsert);
    console.log(`✅ Seeded ${userCats.length} default categories for user.`);
  }

  // Create a fast lookup map for categories (Name -> ObjectId)
  const catMap = {};
  userCats.forEach((c) => {
    catMap[c.name] = c._id;
  });

  // 3. Define raw Income data
  const rawIncomes = [
    // Month 1 (Current Month)
    { title: 'Monthly Salary', amount: 75000, category: 'Salary', source: 'Primary Corp', date: getRelativeDate(1), description: 'Regular monthly paycheck' },
    { title: 'Freelance Design', amount: 14000, category: 'Freelance', source: 'Upwork Project', date: getRelativeDate(5), description: 'UI design consulting work' },
    { title: 'Stocks Dividend', amount: 4500, category: 'Investment', source: 'Zerodha', date: getRelativeDate(12), description: 'Quarterly payouts' },
    
    // Month 2 (Last Month)
    { title: 'Monthly Salary', amount: 75000, category: 'Salary', source: 'Primary Corp', date: getRelativeDate(30), description: 'Regular monthly paycheck' },
    { title: 'Freelance Web Dev', amount: 18000, category: 'Freelance', source: 'Direct Client', date: getRelativeDate(45), description: 'Completed landing page project' },
    { title: 'Birthday Gift', amount: 5000, category: 'Gift', source: 'Family', date: getRelativeDate(38), description: 'Birthday money from parents' },

    // Month 3 (2 Months Ago)
    { title: 'Monthly Salary', amount: 75000, category: 'Salary', source: 'Primary Corp', date: getRelativeDate(60), description: 'Regular monthly paycheck' },
    { title: 'Freelance Design', amount: 12500, category: 'Freelance', source: 'Upwork Project', date: getRelativeDate(75), description: 'Dashboard mockups milestone' },
    { title: 'Investment Return', amount: 6200, category: 'Investment', source: 'Mutual Fund', date: getRelativeDate(80), description: 'Dividend payouts' },
  ];

  // Insert Incomes
  const incomes = rawIncomes.map((inc) => ({ ...inc, user: userId }));
  await Income.insertMany(incomes);
  console.log(`✅ Seeded ${incomes.length} income entries.`);

  // 4. Define raw Expense data
  const rawExpenses = [
    // RENT (Fixed monthly expense)
    { title: 'Apartment Rent', amount: 20000, categoryName: 'Rent', date: getRelativeDate(2), paymentMethod: 'bank', description: 'Rent for current month' },
    { title: 'Apartment Rent', amount: 20000, categoryName: 'Rent', date: getRelativeDate(32), paymentMethod: 'bank', description: 'Rent for last month' },
    { title: 'Apartment Rent', amount: 20000, categoryName: 'Rent', date: getRelativeDate(62), paymentMethod: 'bank', description: 'Rent for 2 months ago' },

    // UTILITIES
    { title: 'Electricity Bill', amount: 2900, categoryName: 'Utilities', date: getRelativeDate(8), paymentMethod: 'upi', description: 'Power grid bill' },
    { title: 'High-speed Wi-Fi', amount: 800, categoryName: 'Utilities', date: getRelativeDate(8), paymentMethod: 'upi', description: 'Act Fibernet monthly' },
    { title: 'Electricity Bill', amount: 3500, categoryName: 'Utilities', date: getRelativeDate(38), paymentMethod: 'upi', description: 'Power grid bill' },
    { title: 'High-speed Wi-Fi', amount: 800, categoryName: 'Utilities', date: getRelativeDate(38), paymentMethod: 'upi', description: 'Act Fibernet monthly' },
    { title: 'Electricity Bill', amount: 3200, categoryName: 'Utilities', date: getRelativeDate(68), paymentMethod: 'upi', description: 'Power grid bill' },
    { title: 'High-speed Wi-Fi', amount: 800, categoryName: 'Utilities', date: getRelativeDate(68), paymentMethod: 'upi', description: 'Act Fibernet monthly' },

    // FOOD & DINING
    // Weekly groceries
    { title: 'Weekly Groceries', amount: 2450, categoryName: 'Food & Dining', date: getRelativeDate(1), paymentMethod: 'upi', description: 'Zepto order' },
    { title: 'Weekly Groceries', amount: 1850, categoryName: 'Food & Dining', date: getRelativeDate(8), paymentMethod: 'upi', description: 'BigBasket order' },
    { title: 'Weekly Groceries', amount: 2100, categoryName: 'Food & Dining', date: getRelativeDate(15), paymentMethod: 'card', description: 'Supermarket visit' },
    { title: 'Weekly Groceries', amount: 1950, categoryName: 'Food & Dining', date: getRelativeDate(22), paymentMethod: 'upi', description: 'Zepto order' },
    { title: 'Weekly Groceries', amount: 2300, categoryName: 'Food & Dining', date: getRelativeDate(29), paymentMethod: 'upi', description: 'Zepto order' },
    { title: 'Weekly Groceries', amount: 1700, categoryName: 'Food & Dining', date: getRelativeDate(36), paymentMethod: 'upi', description: 'BigBasket order' },
    { title: 'Weekly Groceries', amount: 2050, categoryName: 'Food & Dining', date: getRelativeDate(43), paymentMethod: 'card', description: 'Supermarket visit' },
    { title: 'Weekly Groceries', amount: 2200, categoryName: 'Food & Dining', date: getRelativeDate(50), paymentMethod: 'upi', description: 'Zepto order' },
    { title: 'Weekly Groceries', amount: 2150, categoryName: 'Food & Dining', date: getRelativeDate(57), paymentMethod: 'upi', description: 'Zepto order' },
    { title: 'Weekly Groceries', amount: 1600, categoryName: 'Food & Dining', date: getRelativeDate(64), paymentMethod: 'upi', description: 'BigBasket order' },
    { title: 'Weekly Groceries', amount: 1900, categoryName: 'Food & Dining', date: getRelativeDate(71), paymentMethod: 'card', description: 'Supermarket visit' },
    { title: 'Weekly Groceries', amount: 2250, categoryName: 'Food & Dining', date: getRelativeDate(78), paymentMethod: 'upi', description: 'Zepto order' },
    { title: 'Weekly Groceries', amount: 2000, categoryName: 'Food & Dining', date: getRelativeDate(85), paymentMethod: 'upi', description: 'Zepto order' },
    // Restaurants & Ordering
    { title: 'Dinner at Restaurant', amount: 1200, categoryName: 'Food & Dining', date: getRelativeDate(4), paymentMethod: 'card', description: 'Pizza & drinks with friends' },
    { title: 'Office Lunch Delivery', amount: 350, categoryName: 'Food & Dining', date: getRelativeDate(6), paymentMethod: 'upi', description: 'Swiggy order' },
    { title: 'Zomato Biryani', amount: 750, categoryName: 'Food & Dining', date: getRelativeDate(11), paymentMethod: 'upi', description: 'Family dinner' },
    { title: 'Cafe Coffee & Snacks', amount: 450, categoryName: 'Food & Dining', date: getRelativeDate(14), paymentMethod: 'upi', description: 'Starbucks coffee' },
    { title: 'Fine Dining', amount: 2800, categoryName: 'Food & Dining', date: getRelativeDate(18), paymentMethod: 'card', description: 'Celebration dinner' },
    { title: 'Fast Food Lunch', amount: 300, categoryName: 'Food & Dining', date: getRelativeDate(24), paymentMethod: 'cash', description: 'McDonalds' },
    { title: 'Weekly Swiggy Orders', amount: 1400, categoryName: 'Food & Dining', date: getRelativeDate(26), paymentMethod: 'upi', description: 'Assorted food deliveries' },
    { title: 'Cafe Work Session', amount: 480, categoryName: 'Food & Dining', date: getRelativeDate(35), paymentMethod: 'upi', description: 'Coffee and muffin' },
    { title: 'Dinner with Client', amount: 3200, categoryName: 'Food & Dining', date: getRelativeDate(40), paymentMethod: 'card', description: 'Business dinner' },
    { title: 'Street Food Crawl', amount: 400, categoryName: 'Food & Dining', date: getRelativeDate(47), paymentMethod: 'cash', description: 'Street food with friends' },
    { title: 'Desserts & Ice Cream', amount: 380, categoryName: 'Food & Dining', date: getRelativeDate(55), paymentMethod: 'upi', description: 'Corner House' },
    { title: 'Swiggy Weekend Feast', amount: 1800, categoryName: 'Food & Dining', date: getRelativeDate(68), paymentMethod: 'upi', description: 'Weekend party food' },
    { title: 'Quick Office Lunch', amount: 280, categoryName: 'Food & Dining', date: getRelativeDate(73), paymentMethod: 'cash', description: 'Subway wrap' },
    { title: 'Japanese Sushi Dinner', amount: 2500, categoryName: 'Food & Dining', date: getRelativeDate(83), paymentMethod: 'card', description: 'Sushi dinner' },

    // TRANSPORT
    { title: 'Petrol Refuel', amount: 1600, categoryName: 'Transport', date: getRelativeDate(7), paymentMethod: 'upi', description: 'Full tank fuel' },
    { title: 'Uber Go Ride', amount: 420, categoryName: 'Transport', date: getRelativeDate(3), paymentMethod: 'upi', description: 'Commute to office' },
    { title: 'Metro Smartcard Recharge', amount: 500, categoryName: 'Transport', date: getRelativeDate(11), paymentMethod: 'upi', description: 'Monthly pass topup' },
    { title: 'Uber Premier', amount: 580, categoryName: 'Transport', date: getRelativeDate(13), paymentMethod: 'upi', description: 'Rainy day commute' },
    { title: 'Petrol Refuel', amount: 1700, categoryName: 'Transport', date: getRelativeDate(22), paymentMethod: 'upi', description: 'Full tank fuel' },
    { title: 'Uber Go Ride', amount: 350, categoryName: 'Transport', date: getRelativeDate(20), paymentMethod: 'upi', description: 'Commute to office' },
    { title: 'Uber Premier', amount: 640, categoryName: 'Transport', date: getRelativeDate(32), paymentMethod: 'upi', description: 'Return from party' },
    { title: 'Petrol Refuel', amount: 1500, categoryName: 'Transport', date: getRelativeDate(38), paymentMethod: 'upi', description: 'Car refuel' },
    { title: 'Car Servicing & Wash', amount: 2800, categoryName: 'Transport', date: getRelativeDate(45), paymentMethod: 'card', description: 'Routine checkup and detailing' },
    { title: 'Metro Smartcard Recharge', amount: 500, categoryName: 'Transport', date: getRelativeDate(49), paymentMethod: 'upi', description: 'Metro recharge' },
    { title: 'Petrol Refuel', amount: 1600, categoryName: 'Transport', date: getRelativeDate(52), paymentMethod: 'upi', description: 'Car refuel' },
    { title: 'Uber Go Ride', amount: 520, categoryName: 'Transport', date: getRelativeDate(62), paymentMethod: 'upi', description: 'Client meeting commute' },
    { title: 'Petrol Refuel', amount: 1500, categoryName: 'Transport', date: getRelativeDate(68), paymentMethod: 'upi', description: 'Car refuel' },
    { title: 'Uber Premier', amount: 450, categoryName: 'Transport', date: getRelativeDate(82), paymentMethod: 'upi', description: 'Airport pick up' },
    
    // SHOPPING
    { title: 'Summer Shirts & Jeans', amount: 2800, categoryName: 'Shopping', date: getRelativeDate(16), paymentMethod: 'card', description: 'H&M clothing' },
    { title: 'Mechanical Keyboard', amount: 5400, categoryName: 'Shopping', date: getRelativeDate(10), paymentMethod: 'card', description: 'Keychron K2 wireless keyboard' },
    { title: 'Running Shoes', amount: 4500, categoryName: 'Shopping', date: getRelativeDate(42), paymentMethod: 'card', description: 'Nike Pegasus 39' },
    { title: 'Smart Desk Lamp', amount: 1800, categoryName: 'Shopping', date: getRelativeDate(34), paymentMethod: 'upi', description: 'Xiaomi smart desk lamp' },
    { title: 'Amazon Home Essentials', amount: 2400, categoryName: 'Shopping', date: getRelativeDate(65), paymentMethod: 'upi', description: 'Towels, organizers and hangers' },
    { title: 'Branded Sunglasses', amount: 3200, categoryName: 'Shopping', date: getRelativeDate(72), paymentMethod: 'card', description: 'Ray-Ban sunglasses' },

    // ENTERTAINMENT
    { title: 'Netflix Premium', amount: 649, categoryName: 'Entertainment', date: getRelativeDate(0), paymentMethod: 'card', description: 'Monthly auto-renew subscription' },
    { title: 'Spider-man IMAX Ticket', amount: 1200, categoryName: 'Entertainment', date: getRelativeDate(13), paymentMethod: 'upi', description: 'Movie tickets with pop-corn' },
    { title: 'Netflix Premium', amount: 649, categoryName: 'Entertainment', date: getRelativeDate(30), paymentMethod: 'card', description: 'Monthly auto-renew subscription' },
    { title: 'Music Concert Ticket', amount: 2000, categoryName: 'Entertainment', date: getRelativeDate(25), paymentMethod: 'card', description: 'Indie rock band show' },
    { title: 'Cinema Movie Night', amount: 900, categoryName: 'Entertainment', date: getRelativeDate(44), paymentMethod: 'upi', description: 'Movie tickets' },
    { title: 'Netflix Premium', amount: 649, categoryName: 'Entertainment', date: getRelativeDate(60), paymentMethod: 'card', description: 'Monthly auto-renew subscription' },
    { title: 'Board Game Cafe', amount: 800, categoryName: 'Entertainment', date: getRelativeDate(74), paymentMethod: 'cash', description: 'Played Catan with friends' },
    { title: 'Amusement Park Ticket', amount: 1500, categoryName: 'Entertainment', date: getRelativeDate(54), paymentMethod: 'card', description: 'Weekend trip' },

    // HEALTH
    { title: 'Monthly Multivitamins', amount: 2100, categoryName: 'Health', date: getRelativeDate(11), paymentMethod: 'upi', description: '1mg medicines order' },
    { title: 'Dentist Clean Up', amount: 850, categoryName: 'Health', date: getRelativeDate(37), paymentMethod: 'upi', description: 'Annual dental prophylaxis' },
    { title: 'Gym Equipment Gym Chalk', amount: 1200, categoryName: 'Health', date: getRelativeDate(67), paymentMethod: 'upi', description: 'Gym gears' },

    // OTHER
    { title: 'Monthly Gift for Friend', amount: 950, categoryName: 'Other', date: getRelativeDate(5), paymentMethod: 'upi', description: 'Flowers and chocolate' },
    { title: 'Dry Cleaning Service', amount: 300, categoryName: 'Other', date: getRelativeDate(21), paymentMethod: 'cash', description: 'Suits laundry' },
    { title: 'Lost Bet to Colleague', amount: 650, categoryName: 'Other', date: getRelativeDate(51), paymentMethod: 'upi', description: 'Treat for football match bet' },
    { title: 'Key Duplication', amount: 400, categoryName: 'Other', date: getRelativeDate(81), paymentMethod: 'cash', description: 'Spare apartment keys' },
  ];

  // Map category name to ObjectId in rawExpenses and format it
  const expenses = rawExpenses.map((exp) => {
    const categoryId = catMap[exp.categoryName] || null;
    return {
      user: userId,
      category: categoryId,
      title: exp.title,
      amount: exp.amount,
      date: exp.date,
      paymentMethod: exp.paymentMethod,
      description: exp.description || '',
    };
  });

  // Insert Expenses
  const insertedExpenses = await Expense.insertMany(expenses);
  console.log(`✅ Seeded ${insertedExpenses.length} expense entries.`);

  // 5. Define and seed Budgets
  // We want to calculate the spent amount dynamically for the current month!
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Group current month's expenses by category ID
  const spentMap = {};
  insertedExpenses.forEach((exp) => {
    if (exp.date >= startOfMonth && exp.date <= endOfMonth && exp.category) {
      const catIdStr = exp.category.toString();
      spentMap[catIdStr] = (spentMap[catIdStr] || 0) + exp.amount;
    }
  });

  const rawBudgets = [
    { categoryName: 'Food & Dining', limit: 15000 },
    { categoryName: 'Transport', limit: 6000 },
    { categoryName: 'Shopping', limit: 12000 },
    { categoryName: 'Entertainment', limit: 5000 },
  ];

  const budgets = rawBudgets
    .map((b) => {
      const catId = catMap[b.categoryName];
      if (!catId) return null;
      return {
        user: userId,
        category: catId,
        limit: b.limit,
        spent: spentMap[catId.toString()] || 0,
        period: 'monthly',
        startDate: startOfMonth,
        endDate: endOfMonth,
        alertThreshold: 80,
      };
    })
    .filter(Boolean);

  await Budget.insertMany(budgets);
  console.log(`✅ Seeded ${budgets.length} budgets with correct current spent amounts.`);
  console.log(`🎉 Seeding completed for user ${userId}!`);
};
