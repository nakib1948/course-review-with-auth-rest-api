"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.previousPassword = {
        firstPassword: '',
        secondPassword: '',
    };
    const result = yield user_model_1.User.create(payload);
    const _a = result.toObject(), { password, previousPassword } = _a, rest = __rest(_a, ["password", "previousPassword"]);
    return rest;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findOne({ username: payload.username });
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    if (payload.password !== (isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'password donot matched!');
    }
    const jwtPayload = {
        _id: isUserExists._id,
        role: isUserExists.role,
        email: isUserExists.email,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: '10d',
    });
    const userData = {
        _id: isUserExists._id,
        username: isUserExists.username,
        email: isUserExists.email,
        role: isUserExists.role,
    };
    return {
        user: userData,
        token: accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const getUser = yield user_model_1.User.findOne({ email: user.email });
    if ((getUser === null || getUser === void 0 ? void 0 : getUser.password) !== payload.currentPassword) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'currentPassword does not match!');
    }
    if (payload.newPassword === (getUser === null || getUser === void 0 ? void 0 : getUser.previousPassword.firstPassword) ||
        payload.newPassword === (getUser === null || getUser === void 0 ? void 0 : getUser.previousPassword.secondPassword) ||
        payload.currentPassword === payload.newPassword) {
        const formattedDateTimeString = new Date().toISOString();
        return { data: formattedDateTimeString, success: false };
    }
    const updatedPassword = payload.newPassword;
    const previousPassword = {
        firstPassword: getUser === null || getUser === void 0 ? void 0 : getUser.previousPassword.secondPassword,
        secondPassword: getUser === null || getUser === void 0 ? void 0 : getUser.password,
    };
    const result = yield user_model_1.User.findOneAndUpdate({ email: user.email }, { password: updatedPassword, previousPassword }, { new: true, lean: true });
    const userData = {
        _id: result._id,
        username: result.username,
        email: result.email,
        role: result.role,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
    };
    return { data: userData, success: true };
});
exports.UserServices = {
    createUserIntoDB,
    loginUser,
    changePassword,
};
