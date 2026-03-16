"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const productService = __importStar(require("../services/product.service"));
const constants_1 = require("../constants");
const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        const response = {
            productos: products,
            total: products.length,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProducts = getProducts;
const getProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const product = await productService.getProductById(id);
        if (!product) {
            return res
                .status(404)
                .json({ message: constants_1.ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProduct = getProduct;
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const product = await productService.createProduct(productData);
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updateData = req.body;
        const product = await productService.updateProduct(id, updateData);
        res.json(product);
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await productService.deleteProduct(id);
        res.json({ success: true, message: constants_1.SUCCESS_MESSAGES.PRODUCT_DELETED });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
