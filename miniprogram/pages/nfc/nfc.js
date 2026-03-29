Page({
  data: {
    nfcContent: ''
  },
  onLoad() {
    if (wx.getSystemInfoSync().platform !== 'android') {
      wx.showToast({ title: '仅支持安卓手机', icon: 'none' });
      return;
    }
    this.startNFC();
  },
  startNFC() {
    const nfc = wx.getNFCAdapter();
    nfc.startDiscovery({
      success: () => {
        wx.showToast({ title: '请将NFC标签靠近手机', icon: 'none' });
        nfc.onDiscovered(res => {
          // 只打印uuid和type
          let uuid = '';
          if (res.id) {
            const idArr = new Uint8Array(res.id);
            uuid = Array.from(idArr).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
          }
          const type = res.techs ? res.techs.join(', ') : '';
          const info = `UUID: ${uuid}\nType: ${type}`;
          this.setData({ nfcContent: info });
          wx.showToast({ title: '读取成功', icon: 'success' });
        });
      },
      fail: err => {
        wx.showToast({ title: 'NFC初始化失败', icon: 'none' });
      }
    });
  }
});
