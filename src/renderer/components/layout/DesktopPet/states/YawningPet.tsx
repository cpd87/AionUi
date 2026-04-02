/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const YawningPet = () => (
  <svg viewBox='-18 -18 58 58' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ width: '100%', height: '100%' }}>
    <defs>
      <style>{`
        .yawn-body{transform-origin:11px 18px;animation:yawn-lean 3s ease-in-out infinite}
        .yawn-mouth{transform-origin:11px 14px;animation:yawn-open 3s ease-in-out infinite}
        .yawn-shadow{transform-origin:11px 22.5px;animation:yawn-shadow 3s ease-in-out infinite}
        @keyframes yawn-lean{0%,100%{transform:translateY(0) scaleY(1)}30%{transform:translateY(1px) scaleY(.96)}60%{transform:translateY(-1px) scaleY(1.03)}}
        @keyframes yawn-open{0%,100%{transform:scaleY(.3)}25%,75%{transform:scaleY(1)}50%{transform:scaleY(1.3)}}
        @keyframes yawn-shadow{0%,100%{transform:scaleX(1);opacity:.3}50%{transform:scaleX(1.05);opacity:.35}}
      `}</style>
    </defs>
    <ellipse className='yawn-shadow' cx='11' cy='22.5' rx='4' ry='0.6' fill='#c0c0c0' />
    <g className='yawn-body'>
      <rect x='2' y='10' width='3' height='3' rx='0.5' fill='#8891b8' opacity='0.6' transform='rotate(45 3.5 11.5)' />
      <rect x='17' y='10' width='3' height='3' rx='0.5' fill='#8891b8' opacity='0.6' transform='rotate(45 18.5 11.5)' />
      <rect x='5' y='6' width='12' height='12' rx='6' fill='#97A0C5' />
      <polygon points='11,1 15,7 7,7' fill='#FF6B35' stroke='rgba(255,255,255,0.4)' strokeWidth='0.5' strokeLinejoin='round' transform='rotate(-8 11 5)' />
      <line x1='8.5' y1='11' x2='10.5' y2='11' stroke='#111827' strokeWidth='1' strokeLinecap='round' />
      <line x1='11.5' y1='11' x2='13.5' y2='11' stroke='#111827' strokeWidth='1' strokeLinecap='round' />
      <g className='yawn-mouth'>
        <ellipse cx='11' cy='14.5' rx='2' ry='2.5' fill='#7a7f99' />
        <ellipse cx='11' cy='14' rx='1.6' ry='1.8' fill='#5c6080' />
      </g>
    </g>
  </svg>
);

export default YawningPet;
