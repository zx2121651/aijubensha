"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./routes/app"));
const admin_1 = __importDefault(require("./routes/admin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// 挂载前台 App 接口路由
app.use('/api/app', app_1.default);
// 挂载后台管理系统接口路由
app.use('/api/admin', admin_1.default);
// 根路由健康检查
app.get('/', (req, res) => {
    res.json({ message: 'Jubensha Backend API is running.', status: 'OK' });
});
app.listen(PORT, () => {
    console.log(`[Server]: 独立后端 API 服务启动在 http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map