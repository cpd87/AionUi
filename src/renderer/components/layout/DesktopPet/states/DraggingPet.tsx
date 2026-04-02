/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const DraggingPet = () => (
  <svg viewBox='-18 -18 58 58' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ width: '100%', height: '100%' }}>
    <defs>
      <style>{`
        .drag-body{transform-origin:11px 12px;animation:drag-stretch .4s ease-in-out infinite alternate}
        .drag-hat{transform-origin:11px 4px;animation:drag-hat-wobble .3s ease-in-out infinite alternate}
        .drag-arm-l{transform-origin:3.5px 10.5px;animation:drag-arm-l .35s ease-in-out infinite alternate}
        .drag-arm-r{transform-origin:18.5px 10.5px;animation:drag-arm-r .35s ease-in-out infinite alternate}
        .drag-shadow{transform-origin:11px 22.5px;animation:drag-shadow .4s ease-in-out infinite alternate}
        @keyframes drag-stretch{from{transform:translateY(-3px) scaleY(1.15) scaleX(.9)}to{transform:translateY(1px) scaleY(.92) scaleX(1.06)}}
        @keyframes drag-hat-wobble{from{transform:rotate(-25deg) translateY(-4px)}to{transform:rotate(20deg) translateY(-2px)}}
        @keyframes drag-arm-l{from{transform:rotate(-60deg)}to{transform:rotate(-30deg)}}
        @keyframes drag-arm-r{from{transform:rotate(60deg)}to{transform:rotate(30deg)}}
        @keyframes drag-shadow{from{transform:scaleX(.6);opacity:.15}to{transform:scaleX(1.2);opacity:.35}}
      `}</style>
    </defs>
    <ellipse className='drag-shadow' cx='11' cy='22.5' rx='4' ry='0.6' fill='#c0c0c0' />
    <g className='drag-body'>
      <g className='drag-arm-l'><rect x='2' y='9' width='3' height='3' rx='0.5' fill='#8891b8' opacity='0.8' transform='rotate(45 3.5 10.5)' /></g>
      <g className='drag-arm-r'><rect x='17' y='9' width='3' height='3' rx='0.5' fill='#8891b8' opacity='0.8' transform='rotate(45 18.5 10.5)' /></g>
      <rect x='5' y='6' width='12' height='12' rx='6' fill='#97A0C5' />
      <g className='drag-hat'><polygon points='11,1 15,7 7,7' fill='#FF6B35' stroke='rgba(255,255,255,0.4)' strokeWidth='0.5' strokeLinejoin='round' /></g>
      <circle cx='11' cy='10.5' r='1.5' fill='white' />
      <circle cx='11' cy='10.5' r='0.8' fill='#111827' />
      <ellipse cx='11' cy='15' rx='1.3' ry='1.6' fill='none' stroke='#111827' strokeWidth='0.9' />
    </g>
  </svg>
);

export default DraggingPet;
