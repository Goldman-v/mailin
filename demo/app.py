import os
import json

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI

# 加载环境变量
load_dotenv()

app = Flask(__name__, template_folder='app/templates', static_folder='app/static')

# 获取OpenAI API密钥
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', "sk-abfb17225cce4bd289c5d769b59dfd0f")

# 初始化OpenAI客户端
client = OpenAI(
    api_key=OPENAI_API_KEY,
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    default_headers={
        "Content-Type": "application/json"
    }
)

# 预定义的风格选项
SCRIPT_STYLES = [
    "温馨", "科幻", "恐怖", "悬疑", "喜剧", "悲剧", "动作", "爱情",
    "奇幻", "历史", "青春", "家庭", "职场", "犯罪", "战争", "冒险"
]

def generate_script_outline(concept, style):
    """调用OpenAI API生成剧本大纲"""
    prompt = f"""
    你是一位经验丰富的剧本编剧。请根据以下剧本概念和风格生成一个详细的剧本大纲，包括故事背景、主要角色、故事结构和主要场景。
    
    剧本概念：{concept}
    剧本风格：{style}
    
    请首先提供一个总体大纲，然后将故事分为合适的幕数（通常是三幕或五幕结构），每一幕简要描述主要情节发展。
    请确保剧本风格与{style}风格相符，在情节、人物塑造和氛围营造上都要体现这一风格特点。
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-r1",
            messages=[
                {"role": "system", "content": "你是一位专业的剧本编剧，擅长创作各类戏剧、电影和电视剧本。"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=20000,
            temperature=1.2
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"发生错误: {str(e)}"

def generate_scene_script(outline, act_number):
    """为指定幕生成具体剧本内容"""
    prompt = f"""
    你是一位经验丰富的剧本编剧。根据以下剧本大纲，请为第{act_number}幕编写详细的剧本内容，
    包括场景描述、人物对话和舞台指示。
    
    剧本大纲：{outline}
    
    请专注于第{act_number}幕的内容，确保对话生动自然，场景描述清晰，
    并且与整体故事大纲保持一致。使用标准剧本格式。
    """
    
    try:
        response = client.chat.completions.create(
            model="deepseek-r1",
            messages=[
                {"role": "system", "content": "你是一位专业的剧本编剧，擅长创作各类戏剧、电影和电视剧本。"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=20000,
            temperature=1.2
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"发生错误: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html', styles=SCRIPT_STYLES)

@app.route('/generate_outline', methods=['POST'])
def generate_outline():
    data = request.get_json()
    concept = data.get('concept', '')
    style = data.get('style', '')
    
    if not concept:
        return jsonify({'error': '请提供剧本概念'}), 400
    
    if not style:
        return jsonify({'error': '请选择剧本风格'}), 400
    
    outline = generate_script_outline(concept, style)
    return jsonify({'outline': outline})

@app.route('/generate_act_script', methods=['POST'])
def generate_act_script():
    data = request.get_json()
    outline = data.get('outline', '')
    act_number = data.get('act_number', 1)
    
    if not outline:
        return jsonify({'error': '请提供剧本大纲'}), 400
    
    script = generate_scene_script(outline, act_number)
    return jsonify({'script': script})

if __name__ == '__main__':
    app.run(debug=True) 