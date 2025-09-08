import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import commonStyles from './styles/Common.module.css';
import agreementStyles from './styles/AgreementStep.module.css';

const AgreementStep = ({ onNext }: { onNext: () => void }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const terms = [
    { id: 'age', label: '[필수] 만 14세 이상입니다' },
    { id: 'terms', label: '[필수] 서비스 이용약관' },
    { id: 'privacy', label: '[필수] 개인정보 수집 및 이용' },
    { id: 'location', label: '[필수] 사용자 위치정보 수집 동의' },
    { id: 'marketing', label: '[선택] 마케팅 정보 수신에 동의합니다' },
  ];

  const handleCheck = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const handleCheckAll = () => {
    if (checkedItems.length === terms.length) {
      setCheckedItems([]);
    } else {
      setCheckedItems(terms.map(term => term.id));
    }
  };

  const isAllChecked = checkedItems.length === terms.length;

  const isNextEnabled = terms
    .filter(term => term.label.includes('[필수]'))
    .every(term => checkedItems.includes(term.id));

  return (
    <div className={commonStyles.signupWrapper}>
      <div className={`${commonStyles.loginDeco} ${commonStyles.circle1}`} />
      <div className={`${commonStyles.loginDeco} ${commonStyles.circle2}`} />

      <h2 className={commonStyles.title}>소상공인을 담다, <span>소담</span></h2>
      <p className={commonStyles.subtitle}>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>

      <div className={commonStyles.card}>
        <h3 className={commonStyles.stepTitle}>
          원활한 서비스 이용을 위해 <br /> 약관동의가 필요해요
        </h3>

        <label className={agreementStyles.checkboxAll}>
          <input
            type="checkbox"
            checked={isAllChecked}
            onChange={handleCheckAll}
          />
          모두 동의
        </label>

        <hr className={agreementStyles.divider} />

        {terms.map(term => (
          <label key={term.id} className={agreementStyles.checkbox}>
            <input
              type="checkbox"
              checked={checkedItems.includes(term.id)}
              onChange={() => handleCheck(term.id)}
            />
            {term.label}
          </label>
        ))}
      </div>

      <button
        className={commonStyles.nextButton}
        onClick={onNext}
        disabled={!isNextEnabled}
      >
        다음
      </button>
    </div>
  );
};

export default AgreementStep;
