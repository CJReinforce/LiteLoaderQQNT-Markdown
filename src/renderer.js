// 运行在 Electron 渲染进程 下的页面脚本

// 使用 markdown-it 渲染每个span标记的内容
function render() {
    const elements = document.querySelectorAll(
        ".message-content > span > span"
    );
    elements.forEach(async (element) => {
        // 特判 @
        if (element.className.includes("text-element--at")) return;
        // 将 QQ 默认生成的 link 合并到 上一个 span 中
        if (element.nextElementSibling && element.nextElementSibling.className && element.nextElementSibling.className.includes("text-link")) {
            element.textContent += element.nextElementSibling.textContent;
            element.parentNode.removeChild(element.nextElementSibling);
        }
        const renderedHTML = await markdown_it.render(element.textContent);
        const tempElement = document.createElement("div");
        tempElement.classList.add('markdown-body');
        tempElement.innerHTML = renderedHTML;
        var elements = tempElement.querySelectorAll("a");
        elements.forEach((e) => {
            e.classList.add("markdown_it_link");
            e.classList.add("text-link");
            e.onclick = async (event) => {
                event.preventDefault();
                const href = event
                    .composedPath()[0]
                    .href.replace("app://./renderer/", "");
                await markdown_it.openLink(href);
                return false;
            };
        });
        element.replaceWith(...tempElement.childNodes);
    });
}

function loadCSSFromURL(url) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
}

onLoad();

function onLoad() {
    const pluginPath = LiteLoader.plugins.markdown_it.path.plugin;

    loadCSSFromURL(`local:///${pluginPath}/src/style/markdown.css`);
    loadCSSFromURL(`local:///${pluginPath}/src/style/hljs-github-dark.css`);
    loadCSSFromURL(`local:///${pluginPath}/src/style/katex.css`);

    const observer = new MutationObserver(async (mutationsList) => {
        var config = await window.markdown_it.getConfig();

        const peer = await LLAPI.getPeer();
        console.log("\x1b[32m[Markdown-IT] peer:\x1b[0m", JSON.stringify(peer, null, 2));
        //TODO: 右键菜单添加getPeer.uid
        
        if (((!config.enableBlack) && (config.whiteUID.includes(peer?.uid))) || (config.enableBlack && (!config.blackUID.includes(peer?.uid)))) {
            for (let mutation of mutationsList) {
                if (mutation.type === "childList") {
                    render();
                }
            }
        }
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
}

// 打开设置界面时触发
export async function onSettingWindowCreated(view) {
    var config = await window.markdown_it.getConfig();
    
    const navBarItem = `
    <body>
    <div class="config_view">
        <section class="path">
        <div class="wrap">
            <div class="list">
            <div class="vertical-list-item">
                <div style="width:90%;">
                <h2>黑名单模式</h2>
                <span class="secondary-text">开关打开则为黑名单模式，关闭则为白名单模式。黑名单模式下，黑名单UID中的窗口不开启markdown-it渲染功能，而其他窗口启用；白名单模式下，白名单UID中的窗口启用markdown-it，而其他窗口不启用。</span></div>
                <div id="switchBlackList" class="q-switch">
                <span class="q-switch__handle"></span>
                </div>
            </div>
            <hr class="horizontal-dividing-line" />
            <div class="vertical-list-item">
                <div style="width:90%;">
                <h2>黑名单UID</h2>
                <span class="secondary-text">UID获取详见LLAPI.getPeer().uid，UID之间使用英文逗号隔开</span>
                <textarea id="blackUID" style="width: 100%; resize: vertical;" placeholder="u_7x7xxxxx1WA,u_wrbxxxxxSfw,..." rows="4" class="margin-top-large"></textarea>
                </div>
            </div>
            <hr class="horizontal-dividing-line" />
            <div class="vertical-list-item">
                <div style="width:90%;">
                <h2>白名单UID</h2>
                <textarea id="whiteUID" style="width: 100%; resize: vertical;" placeholder="u_7x7xxxxx1WA,u_wrbxxxxxSfw,..." rows="4"></textarea>
                </div>
            </div>
            </div>
        </div>
        </section>
        <style> .config_view { margin: 20px; } .config_view .wrap { background-color: var(--fill_light_primary, var(--fg_white)); border-radius: 8px; font-size: min(var(--font_size_3), 18px); line-height: min(var(--line_height_3), 24px); margin-bottom: 20px; overflow: hidden; padding: 0px 16px; } .config_view .vertical-list-item { margin: 12px 0px; display: flex; justify-content: space-between; align-items: center; } .config_view .horizontal-dividing-line { border: unset; margin: unset; height: 1px; background-color: rgba(127, 127, 127, 0.15); } .config_view .secondary-text { color: var(--text_secondary); font-size: min(var(--font_size_2), 16px); line-height: min(var(--line_height_2), 22px); margin-top: 4px; } .margin-top-large { margin-top: 10px; }</style></div>
    </body>
    `;
    const parser = new DOMParser();
    const doc2 = parser.parseFromString(navBarItem, "text/html");
    const node2 = doc2.querySelector("body > div");

    // 黑名单开关
    var qSwitchBlacklist = node2.querySelector("#switchBlackList");
    if (config.enableBlack == null || config.enableBlack == true) {
        qSwitchBlacklist.classList.toggle("is-active");
    }

    qSwitchBlacklist.addEventListener("click", async () => {
        if (qSwitchBlacklist.classList.contains("is-active")) {
            config.enableBlack = false;
        } else {
            config.enableBlack = true;
        }
        qSwitchBlacklist.classList.toggle("is-active");
        await window.markdown_it.saveConfig(config);
    });

    // 黑名单UID
    var blackUIDTextarea = node2.querySelector("#blackUID");
    if (config.blackUID !== undefined) {
        blackUIDTextarea.value = config.blackUID;
    }

    blackUIDTextarea.addEventListener("input", async () => {
        var blackUIDList = blackUIDTextarea.value.split('\n').map(uid => uid.trim().replace(/,$/, ''));
        config.blackUID = blackUIDList.filter(uid => uid !== '');
        await window.markdown_it.saveConfig(config);
    });

    // 白名单UID
    var whiteUIDTextarea = node2.querySelector("#whiteUID");
    if (config.whiteUID !== undefined) {
        whiteUIDTextarea.value = config.whiteUID;
    }

    whiteUIDTextarea.addEventListener("input", async () => {
        var whiteUIDList = whiteUIDTextarea.value.split('\n').map(uid => uid.trim().replace(/,$/, ''));
        config.whiteUID = whiteUIDList.filter(uid => uid !== '');
        await window.markdown_it.saveConfig(config);
    });

    view.appendChild(node2);
}

// export { onLoad };
