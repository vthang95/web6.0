class EnemyBulletController extends BulletController {
    constructor(position, direction, bulletSpeed, angle) {
        super(position, direction, 'BulletType2.png', Nakama.enemyBulletGroup, bulletSpeed, angle);
    }
}
