# 运行与交付

Agent需要读取简历和图片、向用户追问并等待、写文件及运行Node.js。网页生成不需要npm安装。`export-pdf.cjs --check`只检查环境，不安装依赖。

- 已安装Playwright/Puppeteer：自动尝试在当前工程或本Skill附近解析模块。
- Agent有共享模块：传`--module "模块绝对路径"`，支持playwright、playwright-core、puppeteer、puppeteer-core。
- 浏览器路径：传`--browser "Chrome或Chromium可执行文件"`，或设置`PORTFOLIO_BROWSER`。
- 没有自动化模块但已有Chromium：使用浏览器CLI导出，设置有界超时；此模式需另检查版面边界。
- Windows、macOS、Linux使用同一Node脚本与绝对路径。只宣称实际验证过的系统。

默认90秒超时。权限错误按Agent权限机制解决，不使用sudo、递归改权限或静默修改系统配置。不需要任何平台凭证。

index.html和print.html都自包含字体/图片。前者是动态网页；后者是固定1440×810分页版。浏览器打印时选择保存为PDF、背景图形开启、无边距、遵循页面尺寸。

website.zip只含公开内容，不含原简历、问答、evidence、系统路径、Agent配置或密钥。发布时解压，将index.html等文件放进静态网站目录；公开链接和域名托管另行配置。

验收：
1. 姓名、方向、职责及数字归属准确，不漏掉“团队”“约”“课程项目”等限定。
2. 手机390px和电脑1440px无横向溢出、图片缺失、控制台错误；图集/放大/关闭可用。
3. 关闭JS、减少动态效果时正文完整。
4. PDF逐页查看；页数应与print.html相等，姓名/标题可检索。中文字体覆盖广泛字符，不用仅针对作者的小字库。
5. 核对网页包，不含内部证据、源文件路径和补料回复。
