import { clientCache } from "@middlewares/cache.js";
import appConfig from "@configs/app.config.js";
import express from "express";
import errorHandler from "@middlewares/errorHandler.js";
import otakudesuRouter from "@routes/otakudesu.routes.js";
import samehadakuRouter from "@routes/samehadaku.routes.js";
import kuramanimeRouter from "@routes/kuramanime.routes.js";
import setPayload from "@helpers/setPayload.js";
import cors from "cors";

const { PORT } = appConfig;
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");        // Izinkan semua domain
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(clientCache(1));

app.get("/", (req, res) => {
  const routes: IRouteData[] = [
    {
      method: "GET",
      path: "/otakudesu",
      description: "Otakudesu",
      pathParams: [],
      queryParams: [],
    },
    {
      method: "GET",
      path: "/kuramanime",
      description: "Kuramanime",
      pathParams: [],
      queryParams: [],
    },
  ];

  res.json(
    setPayload(res, {
      data: { routes },
    })
  );
});

app.use("/otakudesu", otakudesuRouter);
app.use("/kuramanime", kuramanimeRouter);
app.use("/samehadaku", samehadakuRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
