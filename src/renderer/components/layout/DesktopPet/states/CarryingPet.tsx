/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const CarryingPet = () => (
  <svg viewBox='-18 -18 58 58' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ width: '100%', height: '100%' }}>
    <defs>
      <style>{`
        .carry-body{transform-origin:11px 18px;animation:carry-walk .6s ease-in-out infinite}
        .carry-shadow{transform-origin:11px 22.5px;animation:carry-shadow .6s ease-in-out infinite}
        .carry-box{transform-origin:11px 16px;animation:carry-box-bob .6s ease-in-out infinite}
        @keyframes carry-walk{0%,100%{transform:translateX(0) translateY(0) rotate(0)}25%{transform:translateX(1px) translateY(-1.5px) rotate(2deg)}75%{transform:translateX(-1px) translateY(-1.5px) rotate(-2deg)}}
        @keyframes carry-shadow{0%,100%{transform:scaleX(1);opacity:.3}25%,75%{transform:scaleX(.85);opacity:.2}}
        @keyframes carry-box-bob{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-.5px) rotate(1deg)}75%{transform:translateY(-.5px) rotate(-1deg)}}
      `}</style>
    </defs>
    <ellipse className='carry-shadow' cx='11' cy='22.5' rx='5' ry='0.6' fill='#c0c0c0' />
    <g className='carry-body'>
      <rect x='5' y='6' width='12' height='12' rx='6' fill='#97A0C5' />
      <polygon points='11,1 15,7 7,7' fill='#FF6B35' stroke='rgba(255,255,255,0.4)' strokeWidth='0.5' strokeLinejoin='round' />
      <rect x='10' y='2' width='1' height='1' fill='#e8714a' />
      <rect x='9' y='10.5' width='4' height='1' rx='0.5' fill='#111827' />
      <path d='M9 14 Q11 12.5 13 14' stroke='#111827' strokeWidth='0.9' strokeLinecap='round' fill='none' />
      <g className='carry-box'>
        <rect x='4' y='12' width='3' height='3' rx='1.5' fill='#8891b8' opacity='0.8' />
        <rect x='15' y='12' width='3' height='3' rx='1.5' fill='#8891b8' opacity='0.8' />
        <rect x='6' y='14' width='10' height='7' rx='1' fill='#c8a96e' />
        <rect x='6' y='14' width='10' height='7' rx='1' fill='none' stroke='#a08040' strokeWidth='0.5' />
        <rect x='10' y='14' width='2' height='7' rx='0.3' fill='#e0c070' opacity='0.7' />
        <rect x='7' y='15' width='3' height='0.7' rx='0.3' fill='white' opacity='0.3' />
      </g>
    </g>
  </svg>
);

export default CarryingPet;
