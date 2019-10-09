"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const pixiv = new index_1.default('unpopularguy200112@gmail.com', 'KannaKamui011');
(async () => {
    await pixiv.login();
    let res2 = await pixiv.illustPopularPreview("cute");
    console.log(res2);
})();
//# sourceMappingURL=test.js.map