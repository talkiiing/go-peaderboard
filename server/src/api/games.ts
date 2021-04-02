import { Request, Response } from 'express';
import client from '../kgs/client';

const games = async (req: Request, res: Response) => {
  const extended = 'extended' in req.query;

  const { name } = req.params;

  const id = await client.getGames(name);

  const { gamesDeliver } = client;
  gamesDeliver.wait(id, (gotName) => {
    if (gotName === name) {
      console.log('got name equals name');
      const data = gamesDeliver.receive(id);
      if (data) {
        data.sort(({ timestamp: date1 }, { timestamp: date2 }) => (date1 < date2 ? 1 : -1));

        if (extended) {
          res.json(data);
          return;
        }
        res.json(data.slice(0, 2));
      }
    }
  });
};

export default games;
