# cocolab website

岡山大学コンヴィヴィアルコンピューティング研究室（松田研）のWebサイトです。

ページの編集元は `src/html/*.ejs` です。共通ヘッダー・フッターは
`src/html/_header.ejs` と `src/html/_footer.ejs` で管理します。
`docs/**/*.html` は生成物のため、内容の修正はEJS側で行ってください。

EJSを更新したら、次のコマンドで公開用HTMLを再生成します。

```sh
cd dev
npx gulp ejs
```

EJSと生成されたHTMLを両方コミットしてください。
