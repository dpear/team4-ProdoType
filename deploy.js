import { zip } from 'zip-a-folder';

class TestMe {

    static async main() {
        await zip('./extension', 'extension.zip');
    }
}

TestMe.main();