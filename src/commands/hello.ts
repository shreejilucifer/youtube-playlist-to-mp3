import { logInfo } from '../utils';
import { prompt as ask } from 'inquirer';
import * as yargs from 'yargs';

export type Params = { name?: string };

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

export const builder: { [key: string]: yargs.Options } = {
	name: { type: 'string', required: false, description: 'your name' },
};

export async function handler({ name }: Params) {
	logInfo(`Oh, nice to meet you, ${name || (await askName())}!`);
}