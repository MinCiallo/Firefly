const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// 乾纱凪 (Sana Inui) 壁纸图片列表
// 来源: wallpaper.mob.org
const wallpapers = [
  "https://wallpaper.forfun.com/fetch/07/07e5f013daed1434dea06560317ded06.jpeg",
  "https://wallpaper.forfun.com/fetch/09/09b943cff7484685cb2d981348bdd75f.jpeg",
  "https://wallpaper.forfun.com/fetch/11/116c7bd742c41346d5d884c563fccc5a.jpeg",
  "https://wallpaper.forfun.com/fetch/21/215e3ddf9d2d722a16e435992d354932.jpeg",
  "https://wallpaper.forfun.com/fetch/25/259b4889f532944bebc689f90e59428b.jpeg",
  "https://wallpaper.forfun.com/fetch/29/2928e0e5745f46d4e5e36a14e3d46b9a.jpeg",
  "https://wallpaper.forfun.com/fetch/2b/2b9fc199efdef8732cfe2cd471b7dff3.jpeg",
  "https://wallpaper.forfun.com/fetch/3f/3f4ec327191819d8b3c4cfba6265df8a.jpeg",
  "https://wallpaper.forfun.com/fetch/46/466c144179d676877a438661545265bd.jpeg",
  "https://wallpaper.forfun.com/fetch/4f/4fb996199d4dea625c354a297732b413.jpeg",
  "https://wallpaper.forfun.com/fetch/68/6874a45635e0392c790156c398071255.jpeg",
  "https://wallpaper.forfun.com/fetch/69/6940314d2a9f736d71230214276f28d7.jpeg",
  "https://wallpaper.forfun.com/fetch/6b/6b47d1aacc58d7dacce1324d78f060d3.jpeg",
  "https://wallpaper.forfun.com/fetch/6b/6b51409a7fe99cb88f541d65a11120cf.jpeg",
  "https://wallpaper.forfun.com/fetch/6d/6dfc71391ffa960ff5d358de1bb01a61.jpeg",
  "https://wallpaper.forfun.com/fetch/75/75dffe7cc147e959eac8753c5b41af2b.jpeg",
  "https://wallpaper.forfun.com/fetch/77/77d18776d477ec16bf24c9bb187cce7a.jpeg",
  "https://wallpaper.forfun.com/fetch/7d/7d64dff5f1716036bbca15773009323f.jpeg",
  "https://wallpaper.forfun.com/fetch/7d/7d8778aca77686fcbf6de7e978ed3c86.jpeg",
  "https://wallpaper.forfun.com/fetch/82/824073c2765a23045e99225b7838acc9.jpeg",
  "https://wallpaper.forfun.com/fetch/83/83b001d629f121eea6797b62cdcb4c68.jpeg",
  "https://wallpaper.forfun.com/fetch/90/9052bdc3c49549550a6322440375c0ef.jpeg",
  "https://wallpaper.forfun.com/fetch/99/99416a3ff0ebe4341342c4ec69c96221.jpeg",
  "https://wallpaper.forfun.com/fetch/a8/a8f2b08ee7c1738df919bd5bde507d05.jpeg",
  "https://wallpaper.forfun.com/fetch/ae/aed7073365bf3d72965e8234c6427452.jpeg",
  "https://wallpaper.forfun.com/fetch/af/afb5d036f026d3795724dd5f0ac47fe9.jpeg",
  "https://wallpaper.forfun.com/fetch/b1/b116339410a502b313140277e50a4945.jpeg",
  "https://wallpaper.forfun.com/fetch/c0/c03a51e55a341a1afc390fc936bef994.jpeg",
  "https://wallpaper.forfun.com/fetch/c1/c16ef7461f4516485a2bcb65266bad09.jpeg",
  "https://wallpaper.forfun.com/fetch/c4/c488159a56cdbf66237dba5aaf504980.jpeg",
  "https://wallpaper.forfun.com/fetch/c5/c5b1810ebc9bd6aafa31c757b5efc687.jpeg",
  "https://wallpaper.forfun.com/fetch/c7/c706749586f48f2e8824e1a7f013b0a8.jpeg",
  "https://wallpaper.forfun.com/fetch/c9/c92dcab37e861605cf785b0632948e61.jpeg",
  "https://wallpaper.forfun.com/fetch/cd/cdec41d93ed56c7528047acd72c90d7d.jpeg",
  "https://wallpaper.forfun.com/fetch/df/dfeb83ce799eb17dd5bace729ffc4625.jpeg",
  "https://wallpaper.forfun.com/fetch/ee/ee356e62c87dcd8544a0ec5bbd86b15a.jpeg",
  "https://wallpaper.forfun.com/fetch/f1/f117a372bd6c980f844350cbf00538e7.jpeg",
  "https://wallpaper.forfun.com/fetch/f1/f1c364e97117fe475f352ea55e55d02c.jpeg",
];

// 随机获取
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 首页 - API 文档
app.get("/", (req, res) => {
  res.json({
    name: "乾纱凪 (Sana Inui) 壁纸 API",
    description: "纯白交响曲 (Mashiroiro Symphony) 角色乾纱凪壁纸接口",
    character: {
      name: "乾纱凪",
      name_en: "Sana Inui",
      name_jp: "乾 紗凪",
      source: "纯白交响曲 / ましろ色シンフォニー / Mashiroiro Symphony",
    },
    total: wallpapers.length,
    endpoints: {
      "/all": "获取全部壁纸列表 (JSON)",
      "/random": "随机获取一张壁纸 (302 重定向到图片)",
      "/random/json": "随机获取一张壁纸的 URL (JSON)",
      "/random/:count": "随机获取指定数量的壁纸 URL (JSON, 最多 10 张)",
      "/list": "获取全部壁纸列表 (JSON, 同 /all)",
    },
  });
});

// 获取全部壁纸
app.get("/all", (req, res) => {
  res.json({
    total: wallpapers.length,
    character: "乾纱凪 (Sana Inui)",
    images: wallpapers.map((url, i) => ({
      id: i + 1,
      url,
    })),
  });
});

// 获取全部壁纸 (别名)
app.get("/list", (req, res) => {
  res.redirect("/all");
});

// 随机壁纸 - 重定向到图片
app.get("/random", (req, res) => {
  const url = random(wallpapers);
  res.redirect(url);
});

// 随机壁纸 - JSON 格式
app.get("/random/json", (req, res) => {
  const url = random(wallpapers);
  res.json({
    url,
    random: true,
  });
});

// 随机获取指定数量
app.get("/random/:count", (req, res) => {
  let count = parseInt(req.params.count, 10);
  if (isNaN(count) || count < 1) count = 1;
  if (count > 10) count = 10;

  const shuffled = [...wallpapers].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  res.json({
    count: selected.length,
    images: selected.map((url, i) => ({
      id: i + 1,
      url,
    })),
  });
});

app.listen(PORT, () => {
  console.log(`SANA 壁纸 API 已启动: http://localhost:${PORT}`);
  console.log(`共 ${wallpapers.length} 张壁纸`);
});