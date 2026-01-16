# Expense Frontend Implementation Plan

## Tasks
- [x] Update AddExpenseModal.js to fetch dynamic categories from /api/expense_categories
- [x] Create AddCategoryModal.js for managing categories
- [x] Integrate AddCategoryModal into ExpenseCalculator.js
- [x] Fix field mismatches between frontend and API (title, expense_date, category_name)
- [ ] Enhance ExpenseCalculator.js to include recurring expenses section
- [ ] Create RecurringExpenseModal.js for add/edit recurring expenses
- [ ] Add analytics dashboard in ExpenseCalculator.js using /api/expenses/analytics/summary and /monthly
- [ ] Add mark paid functionality for expenses using /api/expenses/[id]/mark-paid
- [ ] Add upcoming expenses display from /api/expenses/upcoming
- [ ] Integrate all sections into ExpenseCalculator.js with tabs or sections
- [ ] Test API integrations and handle errors/loading states
- [ ] Ensure responsive design and user feedback
