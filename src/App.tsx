/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './AnimatedRoutes';

// 应用程序的主组件，主要负责定义全局的前端路由系统
export default function App() {
  return (
    <div className="w-full min-h-screen bg-black text-white relative overflow-hidden flex flex-col font-sans">
      <Router>
        <AnimatedRoutes />
      </Router>
    </div>
  );
}
