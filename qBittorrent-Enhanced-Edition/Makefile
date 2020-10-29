#
# Copyright (C) 2017-2020
#
# This is free software, licensed under the GNU General Public License v2.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=qBittorrent-Enhanced-Edition
PKG_VERSION:=4.3.0.10
PKG_RELEASE=1

PKG_SOURCE:=$(PKG_NAME)-release-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/c0re100/qBittorrent-Enhanced-Edition/tar.gz/release-$(PKG_VERSION)?
PKG_HASH:=skip

PKG_BUILD_DIR:=$(BUILD_DIR)/qBittorrent-Enhanced-Edition-release-$(PKG_VERSION)

PKG_LICENSE:=GPL-2.0+
PKG_LICENSE_FILES:=COPYING

PKG_BUILD_DEPENDS:=qttools

PKG_BUILD_PARALLEL:=1
PKG_INSTALL:=1
PKG_USE_MIPS16:=0

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
	SECTION:=net
	CATEGORY:=Network
	SUBMENU:=BitTorrent
	DEPENDS:=+libstdcpp \
		+libtorrent-rasterbar \
		+libopenssl \
		+qt5-core \
		+qt5-network \
		+qt5-xml \
		+zlib \
		+python3
	TITLE:=bittorrent client programmed in C++ / Qt
	URL:=https://www.qbittorrent.org/
	PROVIDES:=qBittorrent
endef

define Package/$(PKG_NAME)/description
  qBittorrent is a bittorrent client programmed in C++ / Qt that uses
  libtorrent (sometimes called libtorrent-rasterbar) by Arvid Norberg.
  It aims to be a good alternative to all other bittorrent clients out
  there. qBittorrent is fast, stable and provides unicode support as
  well as many features.
endef

CONFIGURE_VARS += \
  	QT_QMAKE=$(STAGING_DIR_HOSTPKG)/bin \
	QMAKE_LRELEASE=$(STAGING_DIR_HOSTPKG)/bin/lrelease \
	PKG_CONFIG_PATH=$(STAGING_DIR)/usr/lib/pkgconfig

CONFIGURE_ARGS += \
	--disable-gui \
	--enable-stacktrace=no \
	--with-boost=$(STAGING_DIR)/usr

MAKE_VARS += \
	INSTALL_ROOT="$(PKG_INSTALL_DIR)"

TARGET_CFLAGS += -std=c++14 -ffunction-sections -fdata-sections -flto
TARGET_LDFLAGS += -Wl,--gc-sections,--as-needed

define Build/Prepare
	$(call Build/Prepare/Default)
	$(SED) '/<context>/{:a;N;/<\/context>/!ba;/\/gui\//d}' `ls $(PKG_BUILD_DIR)/src/lang/qbittorrent_*.ts`
endef

define Package/$(PKG_NAME)/conffiles
/etc/config/qbittorrent
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_INSTALL_DIR)/usr/bin/qbittorrent-nox $(1)/usr/bin
	$(INSTALL_DIR) $(1)/etc/qBittorrent
	$(INSTALL_DATA) ./files/ipfilter.dat $(1)/etc/qBittorrent/ipfilter.dat
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
