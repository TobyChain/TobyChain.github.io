# 博客更新指南

本博客基于 [Jekyll](https://jekyllrb.com/) 和 [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 主题构建。以下是更新博客内容的简要指南。

## 1. 发布新文章

所有的博客文章都存放在 `_posts` 目录下。

1.  在 `_posts` 目录下新建一个 Markdown 文件。
2.  文件名格式必须为：`YYYY-MM-DD-title.md`（例如：`2024-05-21-hello-world.md`）。
3.  在文件开头添加 Front Matter（元数据）：
    ```yaml
    ---
    title: 文章标题
    date: 2024-05-21 12:00:00 +0800
    categories: [分类1, 分类2]
    tags: [标签1, 标签2]
    layout: post
    ---
    ```
4.  在下方编写正文内容。

## 2. 修改“关于我”信息

*   **个人简介**：可以在 `_tabs/about.md` 中修改（如果该文件不存在，可以创建一个）。
*   **侧边栏信息**：
    *   **头像/名字/邮箱**：修改 `_config.yml` 中的 `avatar`, `social.name`, `social.email` 等字段。
    *   **社交链接**：修改 `_data/contact.yml` 文件。

## 3. 修改配置

*   **站点标题/描述**：修改 `_config.yml` 中的 `title`, `tagline`, `description`。
*   **语言**：修改 `_config.yml` 中的 `lang`。

## 4. 本地预览

在终端运行以下命令启动本地服务器：

```bash
bundle exec jekyll serve
```

访问 `http://127.0.0.1:4000` 查看效果。
