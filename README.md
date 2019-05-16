Gitbook Commit log Plugin
==============

show git commit log to your book.

Add the plugin to your `book.json`:

```
{
	"plugins" : [ "commit-log" ]
	"pluginsConfig": {
		templateHead: "## 文档记录\n|Author|Date|History|\n|:--:|:--:|:--:|"
  		"templateBody": "|<img src='http://xxx/avatars/{{name}}/avatar.jpg' class='plugin-commit-log__avatar'><span class='plugin-commit-log__name'>{{name}}</span>|{{date}}|"
	}
}		
```