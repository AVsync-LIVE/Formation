import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Icon } from '../../internal'
import { IconPrefix } from '@fortawesome/fontawesome-common-types'

interface Props {
  value: number,
  step?: number,
  onChange: (value: number) => void,
  min?: number,
  max?: number,
  iconPrefix?: IconPrefix
}

/**
 * This is a number input field component with increment and decrement functionality.
 * The component's value can be manipulated in three ways:
 *   1. Manually entering the value into the number field.
 *   2. Clicking on or holding down the caret up or down icons to increment or decrement the value.
 *   3. Clicking on the number field and dragging up or down to increase or decrease the value.
 * 
 * @component
 * @param {number} value - The current value of the input field.
 * @param {number} [step=0.1] - The amount the value should be incremented or decremented by. Defaults to 0.1.
 * @param {function(number): void} onChange - Function to be executed when the input field's value changes.
 * @param {number} [min] - The minimum value that the input field can hold. This is optional.
 * @param {number} [max] - The maximum value that the input field can hold. This is optional.
 * @param {IconPrefix} [iconPrefix='fas'] - The prefix for the FontAwesome icons used for the increment and decrement buttons. Defaults to 'fas' (solid).
 * 
 * @example
 * // Using default step = 0.1, min = undefined, max = undefined, iconPrefix = 'fas'
 * <NumberInput value={3.4} onChange={newValue => console.log(newValue)} />
 * 
 * @example
 * // Using step = 0.5, min = 0, max = 10, iconPrefix = 'far' (regular)
 * <NumberInput value={3.4} step={0.5} min={0} max={10} onChange={newValue => console.log(newValue)} iconPrefix='far' />
 */
export const NumberInput = ({ value, step = 0.1, onChange, min, max, iconPrefix = 'fas' }: Props) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isIncrementing, setIsIncrementing] = useState<boolean>(false);
  const [isDecrementing, setIsDecrementing] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [startValue, setStartValue] = useState<number>(0);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const newValue = Number((startValue + (startY - event.clientY) * step).toFixed(1));
        onChange(newValue);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsIncrementing(false);
      setIsDecrementing(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, startValue, onChange, step]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isIncrementing) {
      intervalId = setInterval(() => {
        const newValue = Number((valueRef.current + step).toFixed(1));
        if (max === undefined || newValue <= max) {
          onChange(newValue);
        }
      }, 150);
    } else if (isDecrementing) {
      intervalId = setInterval(() => {
        const newValue = Number((valueRef.current - step).toFixed(1));
        if (min === undefined || newValue >= min) {
          onChange(newValue);
        }
      }, 150);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isIncrementing, isDecrementing, onChange, step, min, max]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(event.clientY);
    setStartValue(value);
  };

  const handleClickIncrement = (e: any) => {
    e.stopPropagation()
    const newValue = Number((value + step).toFixed(1));
    if (max === undefined || newValue <= max) {
      onChange(newValue);
      setIsIncrementing(true);
    }
  };

  const handleClickDecrement = (e: any) => {
    e.stopPropagation()
    const newValue = Number((value - step).toFixed(1));
    if (min === undefined || newValue >= min) {
      onChange(newValue);
      setIsDecrementing(true);
    }
  };

  return (
    <S.Container>
      <S.NumberInput
        type='number' 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))} 
        onClick={e => e.stopPropagation()}
        onMouseDown={handleMouseDown}
      />
      <S.AdjustContainer>
        <S.Adjust 
          onMouseDown={handleClickIncrement}
          onMouseUp={() => setIsIncrementing(false)}
          onMouseLeave={() => setIsIncrementing(false)}
          onClick={e => e.stopPropagation()}
        >
          <Icon icon='caret-up' iconPrefix={iconPrefix} />
        </S.Adjust>
        <S.Adjust 
          onMouseDown={handleClickDecrement}
          onMouseUp={() => setIsDecrementing(false)}
          onMouseLeave={() => setIsDecrementing(false)}
          onClick={e => e.stopPropagation()}
        >
          <Icon icon='caret-down' iconPrefix={iconPrefix}/>
        </S.Adjust>
      </S.AdjustContainer>
    </S.Container>
  );
}

const S = {
  Container: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  NumberInput: styled.input`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    -webkit-appearance: none;
    margin: 0;
    padding: 0;
    font-size: var(--F_Font_Size);
    padding-bottom: .125rem;
    border: none;
    color: var(--Font_Color);
    background: none;
    text-align: center;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `,
  AdjustContainer: styled.div`
    width: .75rem;
    margin-left: 2px;
  `,
  Adjust: styled.button`
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    width: .75rem;
    height: .65rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    * {
      color: var(--F_Font_Color_Disabled);
    }
    &:hover {
      * {
        color: var(--F_Font_Color);
      }
    }
  `
}
