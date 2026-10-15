# Chinese source fonts

`npm run fonts:fetch` downloads these (about 65 MB, not committed) and checks their SHA-256;
`npm run fonts:subset` subsets them into `styles/fonts-zh/` at build time.

| File | Font | Version | Licence |
|---|---|---|---|
| `LXGWWenKai-Regular.ttf`, `LXGWWenKai-Medium.ttf` | [LXGW WenKai 霞鹜文楷](https://github.com/lxgw/LxgwWenKai) | v1.522 | SIL Open Font License 1.1 |
| `NotoSansSC-Regular.otf`, `NotoSansSC-Medium.otf` | [Noto Sans SC](https://github.com/notofonts/noto-cjk) (SubsetOTF) | Sans2.004 | SIL Open Font License 1.1 |

The subset files are served under new family names (`Ladder WenKai`, `Ladder Noto SC`), as the OFL
asks of modified versions.
