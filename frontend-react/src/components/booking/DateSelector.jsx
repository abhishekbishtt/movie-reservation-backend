import { motion } from 'framer-motion';
import { getDayLabel, formatDate } from '@utils/formatters';
import { getNext7Days } from '@utils/helpers';
import './DateSelector.css';

export function DateSelector({ selectedDate, onDateSelect }) {
    const dates = getNext7Days();

    return (
        <div className="date-selector">
            <h3 className="date-selector-title">Select Date</h3>
            <div className="date-pills">
                {dates.map((date, index) => {
                    const dateStr = formatDate(date, 'yyyy-MM-dd');
                    const isSelected = selectedDate === dateStr;

                    return (
                        <motion.button
                            key={dateStr}
                            className={`date-pill ${isSelected ? 'selected' : ''}`}
                            onClick={() => onDateSelect(dateStr)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="date-pill-day">{getDayLabel(date)}</span>
                            <span className="date-pill-date">{formatDate(date, 'd MMM')}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
