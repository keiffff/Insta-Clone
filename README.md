# Insta-Clone
Hasuraで作ったInstagramのクローンアプリ

## 機能

| フォローしているユーザーの投稿一覧 | 画像をアップロードして新規投稿 |
| --- | --- |
| ![スクリーンショット 2020-03-29 4 07 25](https://user-images.githubusercontent.com/46975885/77831531-11adc500-7173-11ea-9807-d44642834604.png) | ![スクリーンショット 2020-03-29 4 13 03](https://user-images.githubusercontent.com/46975885/77831617-9c8ebf80-7173-11ea-926c-727e413b3d25.png) |

- Subscription(WebSocket通信)を行っているため、新規に投稿された場合にリアルタイムで画面が更新されます。
- 投稿にはいいね/いいね解除することができます。
- 投稿にはアップロードした画像のurlが紐付けられています。


| プロフィール表示 | プロフィール編集 |
| --- | --- |
| ![スクリーンショット 2020-03-29 4 18 21](https://user-images.githubusercontent.com/46975885/77831757-5a19b280-7174-11ea-9927-21addf523a35.png) | ![スクリーンショット 2020-03-29 4 16 27](https://user-images.githubusercontent.com/46975885/77831707-158e1700-7174-11ea-8616-333847708468.png) |

- 自分以外のユーザーをフォロー/フォロー解除することができます。

| 記事へのコメント | SNSへのシェア |
| --- | --- |
| ![スクリーンショット 2020-03-29 4 31 25](https://user-images.githubusercontent.com/46975885/77832035-5a1ab200-7176-11ea-99b2-9b5045a5cb63.png) | ![スクリーンショット 2020-03-29 4 31 56](https://user-images.githubusercontent.com/46975885/77832068-a108a780-7176-11ea-97cc-6d3f62c334ea.png) |

## 使用技術・構成
![Untitled](https://user-images.githubusercontent.com/46975885/77831445-8d5b4200-7172-11ea-9f0c-5e2d2462266d.png)

- ユーザーはAuth0のログイン画面を通してサインイン/サインアップします。ここでアクセストークンを取得します。
- ログイン済みユーザーはアプリケーション内の操作において、hasura-graphql-engineが提供するAPIを通してPostgreSQLに対して任意のCRUD操作を行います。
- 画像アップロードはhasuraでは非対応であるため、別のGraphQLエンドポイントに対して実行します。Google Cloud Storageに画像をアップロードし、返却されたurlをhasuraの投稿データと紐付けています。
