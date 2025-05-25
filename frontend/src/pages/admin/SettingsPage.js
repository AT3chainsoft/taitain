import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { WalletIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [editMode, setEditMode] = useState({});
  const [savingKey, setSavingKey] = useState(null);

  // Settings categories
  const settingsCategories = [
    {
      title: 'Deposit Settings',
      icon: WalletIcon,
      description: 'Configure deposit parameters and wallet addresses',
      settings: [
        {
          key: 'min_deposit_amount',
          label: 'Minimum Deposit Amount',
          placeholder: 'Enter minimum deposit amount',
          description: 'Minimum USDT amount users can deposit (0.1 USDT for testing)'
        }
      ]
    },
    {
      title: 'Wallet Addresses',
      icon: WalletIcon,
      description: 'Configure wallet addresses for different networks',
      settings: [
        {
          key: 'usdt_trc20',
          label: 'USDT (TRC20)',
          placeholder: 'Enter TRC20 wallet address for USDT',
          description: 'USDT deposit address on TRON network'
        },
        {
          key: 'usdt_polygon',
          label: 'USDT (Polygon)',
          placeholder: 'Enter Polygon wallet address for USDT',
          description: 'USDT deposit address on Polygon network'
        },
        {
          key: 'usdc_trc20',
          label: 'USDC (TRC20)',
          placeholder: 'Enter TRC20 wallet address for USDC',
          description: 'USDC deposit address on TRON network'
        },
        {
          key: 'usdc_polygon',
          label: 'USDC (Polygon)',
          placeholder: 'Enter Polygon wallet address for USDC',
          description: 'USDC deposit address on Polygon network'
        }
      ]
    },
    {
      title: 'Staking Configuration',
      icon: CurrencyDollarIcon,
      description: 'Configure staking parameters',
      settings: [
        {
          key: 'min_stake_amount',
          label: 'Minimum Stake Amount',
          placeholder: 'Enter minimum stake amount',
          description: 'Minimum amount users can stake (USDT)'
        },
        {
          key: 'max_stake_amount',
          label: 'Maximum Stake Amount',
          placeholder: 'Enter maximum stake amount',
          description: 'Maximum amount users can stake (USDT)'
        }
      ]
    },
    {
      title: 'Referral Settings',
      icon: UserGroupIcon,
      description: 'Configure referral program',
      settings: [
        {
          key: 'referral_bonus',
          label: 'Referral Bonus (%)',
          placeholder: 'Enter referral bonus percentage',
          description: 'Percentage of referral bonus on first deposit'
        }
      ]
    }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/admin/settings');
      
      // Transform array to object by key for easier access
      const settingsObject = {};
      response.data.data.forEach(setting => {
        settingsObject[setting.key] = setting.value;
      });
      
      setSettings(settingsObject);
    } catch (error) {
      toast.error('Failed to load settings');
    }
  };

  const handleEdit = (key) => {
    setEditMode({
      ...editMode,
      [key]: true
    });
  };

  const handleSave = async (key) => {
    try {
      const value = editMode[key];
      if (!value) {
        toast.error('Please enter a valid address');
        return;
      }

      setSavingKey(key);
      
      const settingData = {
        value,
        description: settingsCategories.flatMap(category => category.settings).find(s => s.key === key).description
      };
      
      await axios.put(`/api/admin/settings/${key}`, settingData);
      
      setSettings({
        ...settings,
        [key]: value
      });
      
      setEditMode({
        ...editMode,
        [key]: false
      });
      
      toast.success('Setting updated successfully');
    } catch (error) {
      toast.error('Failed to update setting');
    } finally {
      setSavingKey(null);
    }
  };

  const handleChange = (key, value) => {
    setEditMode({
      ...editMode,
      [key]: value
    });
  };

  const handleCancel = (key) => {
    setEditMode({
      ...editMode,
      [key]: false
    });
  };

  return (
    <div className="space-y-6">
      {settingsCategories.map((category) => (
        <div key={category.title} className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <category.icon className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {category.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {category.settings.map((setting) => (
                <div key={setting.key} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {setting.label}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {setting.description}
                      </p>
                    </div>
                    {!editMode[setting.key] && (
                      <button
                        onClick={() => handleEdit(setting.key)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {editMode[setting.key] ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={editMode[setting.key] === true ? (settings[setting.key] || '') : editMode[setting.key]}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        placeholder={setting.placeholder}
                        className="form-input block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      <div className="mt-3 flex justify-end space-x-3">
                        <button
                          onClick={() => handleCancel(setting.key)}
                          className="text-gray-700 hover:text-gray-900 text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(setting.key)}
                          disabled={savingKey === setting.key}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          {savingKey === setting.key ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <div className="text-sm font-mono bg-white p-3 rounded border border-gray-200 break-all">
                        {settings[setting.key] || 'Not set'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SettingsPage;
