import fs from 'fs';

export class JsonHelper {

    static readJSON(filePath: string): Record<string, string>[] {
        
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
}