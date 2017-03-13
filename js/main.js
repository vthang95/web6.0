var Nakama = Nakama || {};

Nakama.configs = {
    GAME_WIDTH_MIN: 320,
    GAME_HEIGHT_MIN: 480,
    GAME_WIDTH_MAX: 640,
    GAME_HEIGHT_MAX: 960,
    SPACESHIP_SIZE_WIDTH: 78,
    SPACESHIP_SIZE_HEIGHT: 78,
    enemy: {
        EnemySpawnX: Math.floor(Math.random()*460+90),
        EnemySpawnY: Math.floor(Math.random()*200+100)
    }
};

window.onload = function() {
    Nakama.game = new Phaser.Game(
        Nakama.configs.GAME_WIDTH_MAX,
        Nakama.configs.GAME_HEIGHT_MAX,
        Phaser.CANVAS, '', {
        preload: preload,
        create: create,
        update: update,
        render: render
    }, false, false);
}

// preparations before game starts
var preload = () => {
    Nakama.game.scale.minWidth = Nakama.configs.GAME_WIDTH_MIN;
    Nakama.game.scale.minHeight = Nakama.configs.GAME_HEIGHT_MIN;
    Nakama.game.scale.maxWidth = Nakama.configs.GAME_WIDTH_MAX;
    Nakama.game.scale.maxHeight = Nakama.configs.GAME_HEIGHT_MAX;
    Nakama.game.scale.pageAlignHorizontally = true;
    Nakama.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    Nakama.game.time.advancedTiming = true;

    Nakama.game.load.atlasJSONHash('assets', 'Assets/assets.png', 'Assets/assets.json');
    Nakama.game.load.image('background', 'Assets/Map1.png');
}

// initialize the game
var create = () => {
    const SPACESHIP_1_SPAWN_CORDINATE_X = Nakama.configs.GAME_WIDTH_MAX / 2;
    const SPACESHIP_1_SPAWN_CORDINATE_Y = Nakama.configs.GAME_HEIGHT_MAX / 2;

    Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
    Nakama.keyboard = Nakama.game.input.keyboard;

    Nakama.game.add.sprite(0, 0, 'background');

    Nakama.players = [];
    Nakama.players.push(
        new ShipController(
            SPACESHIP_1_SPAWN_CORDINATE_X,
            SPACESHIP_1_SPAWN_CORDINATE_Y,
            'Spaceship1-Player.png',
            {
                up: Phaser.Keyboard.UP,
                down: Phaser.Keyboard.DOWN,
                left: Phaser.Keyboard.LEFT,
                right: Phaser.Keyboard.RIGHT,
                fire: Phaser.Keyboard.SPACEBAR
            }
        ),
        new ShipController(
            SPACESHIP_1_SPAWN_CORDINATE_X,
            SPACESHIP_1_SPAWN_CORDINATE_Y,
            'Spaceship1-Partner.png',
            {
                up: Phaser.Keyboard.W,
                down: Phaser.Keyboard.S,
                left: Phaser.Keyboard.A,
                right: Phaser.Keyboard.D,
                fire: Phaser.Keyboard.G
            }
        )
    );

    Nakama.enemies = [];
    Nakama.enemies.push(
        new EnemyController(
            Nakama.configs.enemy.EnemySpawnX,
            Nakama.configs.enemy.EnemySpawnY,
            'EnemyType1.png',
            {
                velocity: {
                    x: 5,
                    y: 5
                },
                maxX: 550,
                minX: 90,
                maxY: 300,
                minY: 100,
                trajectory: 'horizontal'
            }
        ),
        new EnemyController(
            Nakama.configs.enemy.EnemySpawnX,
            Nakama.configs.enemy.EnemySpawnY,
            'EnemyType2.png',
            {
                velocity: {
                    x: 4,
                    y: 4
                },
                maxX: 550,
                minX: 90,
                maxY: 300,
                minY: 100,
                trajectory: 'zigzag'
            }
        )
    );

}

// update game state each frame
var update = () => {
    Nakama.players.forEach(ship => ship.update());
    Nakama.enemies.forEach(enemy => enemy.update());
}

// before camera render (mostly for debug)
var render = () => {

}
