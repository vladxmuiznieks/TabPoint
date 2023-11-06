// src/components/SettingsPage.js

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import updateSettings from '../redux/settingsReducer.js'; 
import DefaultTemplate from './DefaultTemplate'; 
import styles from './SettingsPage.module.css'; 

const SettingsPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.rootReducer.settings); 
  const [barName, setBarName] = useState(settings.barName || '');
  const [thankYouMessage, setThankYouMessage] = useState(settings.thankYouMessage || '');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        dispatch(updateSettings(response.data));
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, [dispatch]);

  const handleSave = async () => {
    try {
      const response = await axios.put('/api/settings', { barName, thankYouMessage });
      if (response.status === 200) {
        dispatch(updateSettings({ barName, thankYouMessage }));
        alert('Settings updated successfully');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  };

  return (
    <DefaultTemplate>
      <div className={styles.settingsContainer}>
        <h2 className={styles.settingsTitle}>Settings</h2>
        <div className={styles.settingsForm}>
          <label className={styles.inputLabel}>
            Bar Name:
            <input
              className={styles.inputField}
              type="text"
              value={barName}
              onChange={(e) => setBarName(e.target.value)}
            />
          </label>
          <label className={styles.inputLabel}>
            Thank You Message:
            <textarea
              className={styles.textareaField}
              value={thankYouMessage}
              onChange={(e) => setThankYouMessage(e.target.value)}
            />
          </label>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </DefaultTemplate>
  );
};

export default SettingsPage;
