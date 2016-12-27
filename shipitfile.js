module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-npm')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/ex-ng2-home-automation',
      deployTo: '/home/pi/home-automation',
      repositoryUrl: 'https://github.com/Sqwabman/ex-ng2-home-automation.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 2,
      deleteOnRollback: false,
      key: 'C:/Users/Ben/.ssh/id_rsa',
      shallowClone: true,
      rsyncDrive: "/c",
      npm: {
        remote: true
      }
    },
    pi: {
      servers: 'pi@192.168.1.124'
    }
  });
};
