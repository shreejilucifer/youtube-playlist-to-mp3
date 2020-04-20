import { logInfo, logError, logDetail } from '../utils';
import { prompt as ask } from 'inquirer';
import * as yargs from 'yargs';
import * as ytdl from 'ytdl-core';
import * as fs from 'fs';
//@ts-ignore
import * as hbjs from 'handbrake-js';

export type Params = { name?: string; url?: string };

export const command = 'hello';
export const desc = `Let's get to know each other`;

async function askName(): Promise<string> {
	logInfo(':wave:  Hello stranger!');
	const { name } = await ask([
		{
			type: 'input',
			name: 'name',
			message: "What's your name?",
		},
	]);
	return name;
}

async function askURL(): Promise<string> {
	const { url } = await ask([
		{
			type: 'input',
			name: 'url',
			message: 'Enter Youtube URL:',
		},
	]);

	return url;
}

export const builder: { [key: string]: yargs.Options } = {
	name: { type: 'string', required: false, description: 'your name' },
	url: { type: 'string', require: false, description: 'youtube url' },
};

export async function handler(args: Params) {
	// const name = args.name || (await askName());
	const url = args.url || (await askURL());

	// logInfo(`Oh, nice to meet you, ${name}!`);

	const info = await ytdl.getBasicInfo(url);

	logInfo(`Video Title: ${info.title}`);

	const res = await ytdl(url);

	res.pipe(fs.createWriteStream('myvideo.flv'));

	res.on('data', () => {});

	res.on('end', async () => {
		console.log('Video Downloaded ! Starting HBJS');

		await hbjs
			.spawn({ input: 'myvideo.flv', output: 'something.mp3' })
			.on('error', (err: Error) => {
				// invalid user input, no video found etc
				logError(err.message);
			})
			.on('progress', (progress: any) => {
				console.log(
					'Percent complete: %s, ETA: %s',
					progress.percentComplete,
					progress.eta
				);
			});
	});
}
