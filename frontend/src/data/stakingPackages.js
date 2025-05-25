/**
 * Shared staking package data used by both desktop and mobile versions
 * to ensure consistent package offerings across the platform
 */

export const stakingPackages = [
  {
    id: 1,
    name: "Starter",
    amount: 100,
    percentage: 1.5,  // Weekly percentage
    annualPercentage: 78, // Annual percentage
    lockPeriod: 1,
    minAmount: 100,
    maxAmount: 499,
    description: "Ideal for beginners, flexible with weekly payments"
  },
  {
    id: 2,
    name: "Growth",
    amount: 500,
    percentage: 2.0,  // Weekly percentage
    annualPercentage: 104, // Annual percentage
    lockPeriod: 3,
    minAmount: 500,
    maxAmount: 999,
    description: "Balanced returns with a moderate lock period"
  },
  {
    id: 3,
    name: "Premium",
    amount: 1000,
    percentage: 2.5,  // Weekly percentage
    annualPercentage: 130, // Annual percentage
    lockPeriod: 6,
    minAmount: 1000,
    maxAmount: 4999,
    description: "Higher returns with a longer commitment"
  },
  {
    id: 4,
    name: "Elite",
    amount: 5000,
    percentage: 3.0,  // Weekly percentage
    annualPercentage: 156, // Annual percentage
    lockPeriod: 12,
    minAmount: 5000,
    maxAmount: null,
    description: "Maximum returns for serious investors"
  }
];

export default stakingPackages;
