document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const conceptTextarea = document.getElementById('concept');
    const styleSelect = document.getElementById('style');
    const generateBtn = document.getElementById('generate-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const outlineSection = document.getElementById('outline-section');
    const outlineContent = document.getElementById('outline-content');
    const actsSection = document.getElementById('acts-section');
    const actsContainer = document.getElementById('acts-container');
    const scriptSection = document.getElementById('script-section');
    const scriptContent = document.getElementById('script-content');
    const currentActTitle = document.getElementById('current-act-title');
    const prevActBtn = document.getElementById('prev-act-btn');
    const nextActBtn = document.getElementById('next-act-btn');
    const loadingOutline = document.getElementById('loading-outline');
    const loadingScript = document.getElementById('loading-script');

    // 状态变量
    let currentOutline = '';
    let generatedScripts = {};
    let currentAct = 1;
    let totalActs = 0;
    let actNumbers = [];
    let currentStyle = '';

    // 监听生成大纲按钮点击
    generateBtn.addEventListener('click', async () => {
        const concept = conceptTextarea.value.trim();
        const style = styleSelect.value;
        
        if (!concept) {
            alert('请输入剧本概念');
            return;
        }
        
        if (!style) {
            alert('请选择剧本风格');
            return;
        }
        
        // 显示加载动画
        loadingOutline.classList.remove('hidden');
        generateBtn.disabled = true;
        
        try {
            const response = await fetch('/generate_outline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ concept, style })
            });
            
            const data = await response.json();
            
            if (data.error) {
                alert(`错误: ${data.error}`);
                return;
            }
            
            // 显示大纲
            currentOutline = data.outline;
            currentStyle = style;
            displayOutline(currentOutline);
            extractActNumbers(currentOutline);
            
            // 显示幕按钮
            createActButtons();
            
            // 重置生成的剧本
            generatedScripts = {};
            currentAct = 1;
            updateActNavigation();
            
            // 隐藏剧本区域
            scriptSection.classList.add('hidden');
        } catch (error) {
            alert(`发生错误: ${error.message}`);
        } finally {
            // 隐藏加载动画
            loadingOutline.classList.add('hidden');
            generateBtn.disabled = false;
        }
    });

    // 监听重新生成大纲按钮点击
    regenerateBtn.addEventListener('click', () => {
        generateBtn.click();
    });

    // 上一幕按钮点击
    prevActBtn.addEventListener('click', () => {
        if (currentAct > 1) {
            currentAct--;
            updateActNavigation();
            displayScript(currentAct);
        }
    });

    // 下一幕按钮点击
    nextActBtn.addEventListener('click', () => {
        if (currentAct < totalActs) {
            currentAct++;
            updateActNavigation();
            displayScript(currentAct);
        }
    });

    // 显示大纲
    function displayOutline(outline) {
        outlineContent.textContent = outline;
        outlineSection.classList.remove('hidden');
        actsSection.classList.remove('hidden');
    }

    // 从大纲中提取幕数
    function extractActNumbers(outline) {
        // 尝试从大纲中找出幕数
        const actPattern = /第([一二三四五六七八九十\d]+)幕/g;
        const matches = [...outline.matchAll(actPattern)];
        
        if (matches.length > 0) {
            // 提取到的幕数
            actNumbers = matches.map(match => {
                // 将中文数字转换为阿拉伯数字
                const num = match[1].replace(/[一二三四五六七八九十]/g, char => {
                    return {
                        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
                        '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
                    }[char] || match[1];
                });
                return Number(num);
            });
            
            // 去重并排序
            actNumbers = [...new Set(actNumbers)].sort((a, b) => a - b);
        } else {
            // 默认为三幕结构
            actNumbers = [1, 2, 3];
        }
        
        totalActs = actNumbers.length;
    }

    // 创建幕按钮
    function createActButtons() {
        actsContainer.innerHTML = '';
        
        actNumbers.forEach(actNum => {
            const button = document.createElement('button');
            button.classList.add('act-btn');
            button.textContent = `第${actNum}幕`;
            button.dataset.act = actNum;
            
            button.addEventListener('click', async () => {
                currentAct = actNum;
                updateActNavigation();
                
                if (generatedScripts[actNum]) {
                    // 已经生成过这一幕，直接显示
                    displayScript(actNum);
                } else {
                    // 还没有生成，请求API
                    await generateActScript(actNum);
                }
            });
            
            actsContainer.appendChild(button);
        });
    }

    // 生成指定幕的剧本
    async function generateActScript(actNum) {
        // 显示加载动画
        loadingScript.classList.remove('hidden');
        scriptContent.innerHTML = '';
        scriptSection.classList.remove('hidden');
        
        try {
            const response = await fetch('/generate_act_script', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    outline: currentOutline,
                    act_number: actNum
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                alert(`错误: ${data.error}`);
                return;
            }
            
            // 保存生成的剧本
            generatedScripts[actNum] = data.script;
            
            // 显示剧本
            displayScript(actNum);
        } catch (error) {
            alert(`发生错误: ${error.message}`);
        } finally {
            // 隐藏加载动画
            loadingScript.classList.add('hidden');
        }
    }

    // 显示剧本
    function displayScript(actNum) {
        const script = generatedScripts[actNum];
        if (!script) return;
        
        // 更新当前幕标题
        currentActTitle.textContent = `第${actNum}幕`;
        
        // 高亮当前幕按钮
        document.querySelectorAll('.act-btn').forEach(btn => {
            if (parseInt(btn.dataset.act) === actNum) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 显示剧本内容
        scriptContent.textContent = script;
        scriptSection.classList.remove('hidden');
    }

    // 更新幕导航按钮状态
    function updateActNavigation() {
        prevActBtn.disabled = currentAct <= 1;
        nextActBtn.disabled = currentAct >= totalActs;
    }
}); 