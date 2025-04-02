# AI剧本生成器

这是一个基于OpenAI API的剧本生成Web应用。用户可以输入剧本概念，应用会生成剧本大纲，然后用户可以选择生成具体的分幕剧本内容。

## 功能特点

- 根据用户输入的概念生成剧本大纲
- 自动识别并提取大纲中的幕数结构
- 为每一幕生成详细的剧本内容
- 简洁大方的用户界面
- 响应式设计，适配移动设备

## 技术栈

- 后端：Python + Flask
- 前端：HTML + CSS + JavaScript（原生）
- API：OpenAI API（GPT-3.5-Turbo模型）

## 安装步骤

1. 克隆项目到本地
   ```
   git clone <仓库URL>
   cd ai-script-generator
   ```

2. 安装依赖
   ```
   pip install -r requirements.txt
   ```

3. 配置API密钥
   ```
   cp .env.example .env
   ```
   然后编辑`.env`文件，将`your_api_key_here`替换为你的OpenAI API密钥。

4. 运行应用
   ```
   python app.py
   ```

5. 在浏览器中访问
   ```
   http://127.0.0.1:5000
   ```

## 使用说明

1. 在主页输入剧本概念（例如"一个关于时间旅行者的爱情故事"）
2. 点击"生成剧本大纲"按钮
3. 查看生成的大纲
4. 点击"第X幕"按钮生成对应幕的详细剧本
5. 使用导航按钮切换不同幕的剧本内容

## 获取API密钥

1. 访问[OpenAI API密钥页面](https://platform.openai.com/api-keys)
2. 登录您的OpenAI账户
3. 创建新的API密钥

## 注意事项

- API调用受到OpenAI使用额度和速率限制
- 生成内容可能需要一些时间，请耐心等待
- 由AI生成的内容可能需要人工编辑和润色

## 许可证

MIT 