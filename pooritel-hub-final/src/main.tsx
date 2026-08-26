import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import './mobile-drawer-fix.css';

type Lang = 'fa' | 'en';
type Theme = 'dark' | 'light';
type Product = { id: string; title: string; fa: string; price: string; tag: string; tone: string };