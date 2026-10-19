import { Router } from 'express';
import Category from '../models/Category.js';
const router = Router();
const defaults = [
  ['Computers & Laptops', 'Desktop computers, laptops and accessories', 'Back up your data and securely erase storage devices.'],
  ['Phones & Tablets', 'Mobile phones, tablets and chargers', 'Remove SIM and memory cards and reset the device.'],
  ['TVs & Monitors', 'Screens, televisions and display equipment', 'Avoid breaking screens; keep equipment dry.'],
  ['Small Appliances', 'Small electronic household appliances', 'Keep batteries separate where possible.'],
  ['Batteries & Cables', 'Rechargeable batteries, adapters and cables', 'Do not place damaged batteries in regular waste.']
];
router.get('/categories', async (_req, res, next) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    if (!categories.length) {
      await Category.insertMany(defaults.map(([name, description, disposalInstructions]) => ({ name, description, disposalInstructions })));
      categories = await Category.find().sort({ name: 1 });
    }
    res.json({ categories });
  } catch (e) { next(e); }
});
export default router;
