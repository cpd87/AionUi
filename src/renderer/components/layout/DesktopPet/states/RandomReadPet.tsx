/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const RandomReadPet = () => (
  <svg viewBox='-18 -18 58 58' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ width: '100%', height: '100%' }}>
    <defs>
      <style>{`
        .read-body{transform-origin:11px 12px;animation:read-tilt 5s ease-in-out infinite}
        .read-shadow{transform-origin:11px 22.5px;animation:read-shadow 5s ease-in-out infinite}
        .read-page{animation:read-flip 2.5s ease-in-out infinite}
        @keyframes read-tilt{0%,100%{transform:rotate(0) translateY(0)}50%{transform:rotate(5deg) translateY(1px)}}
        @keyframes read-shadow{0%,100%{transform:scaleX(1);opacity:.3}50%{transform:scaleX(1.05);opacity:.35}}
        @keyframes read-flip{0%,100%{transform:scaleX(1)}50%{transform:scaleX(-1)}}
      `}</style>
    </defs>
    <ellipse className='read-shadow' cx='11' cy='22.5' rx='4' ry='0.6' fill='#c0c0c0' />
    <g className='read-body'>
      <rect x='5' y='6' width='12' height='12' rx='6' fill='#97A0C5' />
      <polygon points='11,1 15,7 7,7' fill='#FF6B35' stroke='rgba(255,255,255,0.4)' strokeWidth='0.5' strokeLinejoin='round' />
      <rect x='10' y='2' width='1' height='1' fill='#e8714a' />
      <rect x='10' y='11.5' width='2' height='1.5' rx='0.5' fill='#111827' />
      <path d='M9.5 14.5 Q11 15.5 12.5 14.5' stroke='#111827' strokeWidth='0.8' strokeLinecap='round' fill='none' />
      <rect x='4' y='14' width='3' height='3' rx='1.5' fill='#8891b8' opacity='0.7' />
      <rect x='15' y='14' width='3' height='3' rx='1.5' fill='#8891b8' opacity='0.7' />
      <rect x='6' y='16' width='4.5' height='5' rx='0.5' fill='#f0ece0' />
      <rect x='11.5' y='16' width='4.5' height='5' rx='0.5' fill='#e8e4d8' />
      <rect x='10.5' y='16' width='1' height='5.5' rx='0.3' fill='#d0c8b0' />
      <rect x='7' y='17.5' width='3' height='0.5' rx='0.2' fill='#b0a890' opacity='0.7' />
      <rect x='7' y='18.8' width='2' height='0.5' rx='0.2' fill='#b0a890' opacity='0.5' />
      <g className='read-page'><rect x='12.5' y='17.5' width='2.5' height='0.5' rx='0.2' fill='#b0a890' opacity='0.7' /></g>
      <rect x='12.5' y='18.8' width='3' height='0.5' rx='0.2' fill='#b0a890' opacity='0.5' />
    </g>
  </svg>
);

export default RandomReadPet;
