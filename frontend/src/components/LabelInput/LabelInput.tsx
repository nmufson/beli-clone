import styles from './LabelInput.module.css';
import { SignUpUserFeedback } from '../../types';
import { useState } from 'react';

interface LabelInputProps {
  type: string;
  name: string;
  value: string;
  label: string | null;
  maxLength: number | undefined;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error: string;
}

const LabelInput = ({
  type,
  name,
  value,
  label = null,
  maxLength = undefined,
  placeholder,
  onChange,
  onBlur,
  error,
}: LabelInputProps) => {
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const onChangeLabel = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setShowLabel(true); // Hide the label if the input is empty
    } else {
      setShowLabel(false);
    }
    onChange(e);
  };

  const handleBlur = (e) => {
    if (onBlur) onBlur(e);

    setShowError(true);
  };

  return (
    <>
      <div className={styles.inputContainer}>
        {label && showLabel && <label htmlFor={name}>{label}</label>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          placeholder={!showLabel ? placeholder : ''}
          maxLength={maxLength}
          onBlur={handleBlur}
          onChange={onChangeLabel}
          className={error ? 'input-error' : ''}
        />
        <p className={`error-message ${styles.errorMessage}`}>
          {showError ? error : ''}
        </p>
      </div>
    </>
  );
};

export default LabelInput;
