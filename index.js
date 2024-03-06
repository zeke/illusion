import fs from "node:fs/promises";
import promptmaker from "promptmaker";
import Replicate from 'replicate'
import dotenv from 'dotenv'
import download from 'download';
import { slugify } from 'transliteration';
import path from 'node:path';
dotenv.config()

const replicate = new Replicate()
const model = 'andreasjansson/illusion:75d51a73fce3c00de31ed9ab4358c73e8fc0f627dc8ce975818e653317cb919b'

async function run () {
  const input = {
    image: await fs.readFile("hole.png"),
    prompt: promptmaker({subject: 'cat'}),
    qr_code_content: "https://replicate.com/andreasjansson/illusion"
  }
  
  console.log(input.prompt)
  const output = await replicate.run(model, { input })
  console.log({input, output})

  const outputDir = 'outputs';
  await fs.mkdir(outputDir, { recursive: true });

  for (const url of output) {
    const urlPath = new URL(url).pathname;
    const segments = urlPath.split('/');
    const secondToLastSegment = segments[segments.length - 2];
    const fileExtension = path.extname(urlPath);
    const filename = `${secondToLastSegment}-${slugify(input.prompt)}${fileExtension}`;

    await download(url, outputDir, { filename });
  }

}

const generations = 100
for (let i = 0; i < generations; i++) {
  run()
}

