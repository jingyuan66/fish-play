Page({
  data: {
    nfcContent: ''
  },
  onLoad() {
    console.log('NFC页面加载',wx.getDeviceInfo);

    if (wx.getDeviceInfo) {
      wx.getDeviceInfo({
        success: res => {
          console.log('设备信息', res);
          const isHarmonyOS = res.system && res.system.indexOf('HarmonyOS') !== -1;
          const isAndroid = res.platform === 'android';
          const isIOS = res.platform === 'ios';

          if (isIOS) {
            wx.showToast({ title: 'iOS暂不支持NFC读取', icon: 'none' });
            this.setData({ nfcContent: 'iOS系统暂不支持NFC读取功能' });
            return;
          }

          if (!isAndroid && !isHarmonyOS) {
            wx.showToast({ title: '仅支持安卓或鸿蒙手机', icon: 'none' });
            return;
          }

          if (isHarmonyOS) {
            wx.showToast({ title: '鸿蒙平台，功能可能有限制', icon: 'none' });
          }

          this.startNFC();
        },
        fail: () => {
          console.error('无法获取设备信息');
          wx.showToast({ title: '无法获取设备信息', icon: 'none' });
        }
      });
    } else {
      wx.showToast({ title: '微信版本过低', icon: 'none' });
    }
  },
  startNFC() {
    const nfc = wx.getNFCAdapter();
    nfc.startDiscovery({
      success: () => {
        wx.showToast({ title: '请将NFC标签靠近手机', icon: 'none' });
        nfc.onDiscovered(res => {
          console.log(res);

          let uuid = '';
          if (res.id) {
            const idArr = new Uint8Array(res.id);
            uuid = Array.from(idArr).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
          }

          const type = res.techs ? res.techs.join(', ') : '';
          const info = `UUID: ${uuid}\nType: ${type}\n注意：鸿蒙可能无法读取NDEF数据`;

          this.setData({ nfcContent: info });
          wx.showToast({ title: '读取成功', icon: 'success' });
        });
      },
      fail: err => {
        console.error('NFC初始化失败', err);
        wx.showToast({ title: 'NFC初始化失败：' + (err.errMsg || '未知错误'), icon: 'none' });
      }
    });
  }
});