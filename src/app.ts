import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import path from 'path';
import cors from 'fastify-cors';
import getRenderedTemplate from './utils/getRenderedTemplate';

const app = fastify({ logger: true });

app.register(cors);

interface RenderTemplateRequestBody {
  vault: { url: string; token: string };
  envVariables: Record<string, string>;
  template: string;
}

const TMP_DIR = path.resolve(__dirname, 'tmp');

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR);
}

app.post(
  '/render',
  async (request: FastifyRequest<{ Body: RenderTemplateRequestBody }>, reply: FastifyReply): Promise<void> => {
    const {
      body: {
        vault: { url, token },
        envVariables,
        template,
      },
    } = request;

    try {
      reply.send({
        template: await getRenderedTemplate(
          { VAULT_ADDR: url, VAULT_TOKEN: token, ...envVariables },
          template,
          path.resolve(__dirname, 'tmp')
        ),
      });
    } catch (e) {
      reply.code(500).send({ error: 'error.internal' });
    }
  }
);

app.listen(+process.env.PORT || 3000, '0.0.0.0');
