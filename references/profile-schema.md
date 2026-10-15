# profile.json

文件由Agent根据已读资料填写。不要把本示例里的学生经历复制给真实用户。路径相对profile.json解析；网页公开数据采用显式白名单，evidence及source_ids不进入成品。

```json
{
  "schema_version": 1,
  "demo": false,
  "person": {
    "name": "简历中的姓名",
    "role": "目标岗位",
    "headline": "从已有经历提炼的一句具体介绍",
    "summary": "简述求职方向及最相关经历，350字内。",
    "location": "本人愿意展示的城市或求职地点",
    "education": [{"school":"学校","degree":"专业与学历","period":"在校时间"}],
    "contacts": [{"label":"邮箱","value":"本人提供的邮箱","url":"mailto:本人提供的邮箱"}],
    "source_ids": ["resume-1"]
  },
  "strengths": [{"title":"具体优势","description":"用经历支持，120字内。","source_ids":["resume-1"]}],
  "projects": [{
    "id":"campus-project",
    "title":"项目真实名称",
    "category":"校园项目",
    "period":"原材料中提供的时间",
    "role":"本人的真实职责",
    "summary":"一句话交代项目和产出",
    "context":"背景、目标、协作范围，240字内。",
    "actions":["具体做了什么，优先每条40-90字。"],
    "outcomes":["实际产出或复盘；没有数字就省去数字。"],
    "metrics":[],
    "artifacts":[{"file":"materials/作品.png","caption":"作品名称与本人负责部分","source_id":"work-1","public":true,"fit":"contain"}],
    "links":[],
    "source_ids":["resume-1","work-1"]
  }],
  "skills":[{"name":"技能或方法","evidence":"在哪个项目中怎么使用，140字内。","source_ids":["resume-1"]}],
  "evidence":[
    {"id":"resume-1","kind":"resume","excerpt":"必须是简历原文中存在的真实片段"},
    {"id":"work-1","kind":"attachment","file":"materials/作品.png"}
  ]
}
```

## 可选与限制

- 没头像：省略portrait。有且允许展示时用`person.portrait={"file":"照片.png","public":true}`。
- 联系方式没有跳转URL时省略url。支持http、https、mailto、tel，不接受javascript和file链接。
- 没有图片、数字、外链时分别用空数组，不留空白占位页。
- strengths最多4项，skills最多8项，projects最多6项，通常选2-4项。
- metrics每项目最多3项，格式`{"value":"实际数值","label":"含团队/周期的准确口径","source_ids":["对应证据ID"]}`。不从照片或职责描述推算数字。
- artifacts必须为实际PNG/JPEG/WebP/GIF文件；PPT/PDF/代码可由Agent读取后选取确切页面截图，作品截图保持完整且配事实说明。`fit=contain`默认完整显示；仅普通现场照可选cover。
- 每个项目、技能、优势、指标、person需source_ids。来源kind为resume时excerpt须出现在简历正文；message时须出现在补料原回复；attachment时file须存在。
- 没项目也可用空数组，展示教育、已证实能力及联系，不编造项目。
- demo=true只用于整体明确为虚构的测试案例，所有页面都会带可见标识。

## 版式与分页

使用粉蓝米白、文件夹标签、粗标题、项目数字和有密度的说明。封面、介绍、项目案例、图集和联系是不同版式。根据材料自动减少/增加页面：长动作拆续页，多个作品进入图集，无图项目使用交付物文字。先写具体信息，再调整长度。首版PDF为16:9横向1440×810，网页适配手机。
