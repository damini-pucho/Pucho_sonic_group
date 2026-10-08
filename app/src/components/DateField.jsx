import { pickerProps } from '../config/popup';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

/**
 * Designed date picker that replaces <input type="date">.
 * Takes and returns the same 'YYYY-MM-DD' string the native input used,
 * so no calling code or webhook payload changes.
 */
export default function DateField({ value, onChange, placeholder = 'Select date', className = '', ...rest }) {
  const parsed = value ? dayjs(value) : null;
  return (
    <DatePicker
      {...pickerProps}
      value={parsed && parsed.isValid() ? parsed : null}
      onChange={(d) => onChange?.(d ? d.format('YYYY-MM-DD') : '')}
      format="DD MMM YYYY"
      showToday={false}
      placeholder={placeholder}
      className={`w-full ${className}`}
      {...rest}
    />
  );
}
