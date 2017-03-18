var Nakama = Nakama || {};

Nakama.configs = {
    GAME_WIDTH_MIN: 320,
    GAME_HEIGHT_MIN: 480,
    GAME_WIDTH_MAX: 640,
    GAME_HEIGHT_MAX: 960,
    SPACESHIP_SIZE_WIDTH: 78,
    SPACESHIP_SIZE_HEIGHT: 78,
    player: {
        health: 20,
        shipSpeed: 300,
        homingBulletSpeed: 200
    },
    enemy: {
        EnemySpawnX: Math.floor(Math.random() * 410 + 90),
        EnemySpawnY: Math.floor(Math.random() * 200 + 100),
        bulletSpeed: 300,
        bulletAngle: 180,
        damage: 1,
    },
    boss: {
        respawnX: 320,
        respawnY: 100,
        damage: 5,
        health: 200,
        laserBulletSpeed: 500,
        homingBulletSpeed: {
            normalHomingFire: 300,
            heavyStrike: 100
        }
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
    Nakama.game.add.sprite(0, 0, 'background');

    Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
    Nakama.keyboard = Nakama.game.input.keyboard;

    Nakama.healthGroup = Nakama.game.add.physicsGroup();
    Nakama.playerBulletGroup = Nakama.game.add.physicsGroup();
    Nakama.enemyBulletGroup = Nakama.game.add.physicsGroup();
    Nakama.enemyHomingBulletGroup = Nakama.game.add.physicsGroup();
    Nakama.playerGroup = Nakama.game.add.physicsGroup();
    Nakama.enemyGroup = Nakama.game.add.physicsGroup();

    Nakama.players = [];
    Nakama.enemies = [];
    Nakama.bosses = [];

    Nakama.homingBulletControllers = [];

    new ShipController(
        SPACESHIP_1_SPAWN_CORDINATE_X,
        SPACESHIP_1_SPAWN_CORDINATE_Y,
        'Spaceship1-Player.png', {
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            fire: Phaser.Keyboard.SPACEBAR,
            cooldown: 0.1,
            health: Nakama.configs.player.health,
            shipSpeed: Nakama.configs.player.shipSpeed,
        }
    );
    new ShipController(
        SPACESHIP_1_SPAWN_CORDINATE_X,
        SPACESHIP_1_SPAWN_CORDINATE_Y,
        'Spaceship1-Partner.png', {
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S,
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            fire: Phaser.Keyboard.G,
            cooldown: 0.1,
            health: Nakama.configs.player.health,
            shipSpeed: Nakama.configs.player.shipSpeed,
        }
    );

    new EnemyController(
        Nakama.configs.enemy.EnemySpawnX,
        Nakama.configs.enemy.EnemySpawnY,
        'EnemyType1.png', {
            velocity: {
                x: 100,
                y: 100
            },
            maxX: 500,
            minX: 90,
            maxY: 300,
            minY: 100,
            health: 20,
            trajectory: 'horizontal',
            cooldown: 0.5
        }
    );
    new EnemyController(
        Nakama.configs.enemy.EnemySpawnX,
        Nakama.configs.enemy.EnemySpawnY,
        'EnemyType2.png', {
            velocity: {
                x: 300,
                y: 300
            },
            maxX: 500,
            minX: 50,
            maxY: 300,
            minY: 100,
            health: 20,
            trajectory: 'zigzag',
            cooldown: 0.5
        }
    );

    new BossController(
        Nakama.configs.boss.respawnX,
        Nakama.configs.boss.respawnY,
        'EnemyType3.png', {
            cooldown: 0.5,
            velocity: {
                x: 500,
                y: 500
            },
            maxX: 540,
            minX: 100,
            maxY: 300,
            minY: 100
        }
    );

}

var onBulletHitEnemy = (playerBulletSprite, enemySprite) => {
    enemySprite.damage(playerBulletSprite.setDamage);
    playerBulletSprite.kill();
}

var onBulletHitPlayer = (enemyBulletSprite, playerSprite) => {
    playerSprite.damage(enemyBulletSprite.setDamage);
    enemyBulletSprite.kill();
}

var onBulletHitHomingBullet = (playerBulletSprite, enemyHomingBulletSprite) => {
    enemyHomingBulletSprite.damage(playerBulletSprite.setDamage);
    playerBulletSprite.kill();
}

var onHomingBulletHitplayer = (enemyHomingBulletSprite, playerSprite) => {
    playerSprite.damage(enemyHomingBulletSprite.setDamage);
    enemyHomingBulletSprite.kill();
}
// update game state each frame
var update = () => {
    Nakama.allEnemies = Nakama.enemies.concat(Nakama.bosses);
    Nakama.players.forEach(ship => ship.update());
    Nakama.enemies.forEach(enemy => enemy.update());
    Nakama.bosses.forEach(boss => boss.update());
    Nakama.homingBulletControllers.forEach(homingBullet => homingBullet.update());

    Nakama.game.physics.arcade.overlap(
        Nakama.playerBulletGroup,
        Nakama.enemyGroup,
        onBulletHitEnemy);

    Nakama.game.physics.arcade.overlap(
        Nakama.enemyBulletGroup,
        Nakama.playerGroup,
        onBulletHitPlayer);

    Nakama.game.physics.arcade.overlap(
        Nakama.playerBulletGroup,
        Nakama.enemyHomingBulletGroup,
        onBulletHitHomingBullet);

    Nakama.game.physics.arcade.overlap(
        Nakama.enemyHomingBulletGroup,
        Nakama.playerGroup,
        onHomingBulletHitplayer);
}
// before camera render (mostly for debug)
var render = () => {
    Nakama.homingBulletControllers.forEach(homingBullet => homingBullet.render());
    Nakama.players.forEach(player => player.render());
}
