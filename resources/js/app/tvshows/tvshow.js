/*
 * Copyright 2011 slash2009.
 * Copyright 2013 Zernable.
 * Copyright 2013 uNiversal.
 * Copyright 2013, 2014 Andrew Fyfe.
 *
 * This file is part of Web interface Media Manager (WIMM) for kodi.
 *
 * WIMM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * WIMM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with WIMM.  If not, see <http://www.gnu.org/licenses/>.
 */

Ext.ns('TVShow');

function bannerConvert(value, record) {
    return WIMM.util.convertArtworkURL(value.banner);
}

function fanartConvert(value, record) {
    return WIMM.util.convertArtworkURL(value.fanart);
}

var tvShowRecord = Ext.data.Record.create([
   { name: 'tvshowid' },
   { name: 'title' },
   { name: 'sorttitle' },
   { name: 'genre', convert: WIMM.util.convertArrayToList },
   { name: 'year' },
   { name: 'rating', convert: WIMM.util.convertRating },
   { name: 'plot' },
   { name: 'studio', convert: WIMM.util.convertArrayToList },
   { name: 'mpaa' },
   { name: 'playcount' },
   { name: 'episode' },
   { name: 'premiered' },
   { name: 'fanart', mapping: 'art', convert: fanartConvert },
   { name: 'banner', mapping: 'art', convert: bannerConvert },
   { name: 'watchedepisodes' },
   { name: 'tag', convert: WIMM.util.convertArrayToList }
]);

var seasonRecord = Ext.data.Record.create([
   { name: 'season' },
   { name: 'label' },
   { name: 'thumbnail', convert: WIMM.util.convertArtworkURL }
]);

var episodeRecord = Ext.data.Record.create([
    { name: 'episode' },
    { name: 'title' },
    { name: 'rating', convert: WIMM.util.convertRating },
    { name: 'plot' },
    { name: 'firstaired' },
    { name: 'director', convert: WIMM.util.convertArrayToList },
    { name: 'writer', convert: WIMM.util.convertArrayToList },
    { name: 'streamdetails' },
    { name: 'playcount' },
    { name: 'episodeid' },
    { name: 'path', mapping: 'file' },
    { name: 'file', convert: WIMM.util.convertPathToFileName },
    { name: 'directory', mapping: 'file', convert: WIMM.util.convertPathToDirectory }
]);

var actorRecord = Ext.data.Record.create([
    { name: 'name' },
    { name: 'role' }
]);

var sortArticles = docCookies.getItem('sortArticles') === '1';
var storeTVShow = new Ext.data.Store({
    proxy: new Ext.data.KodiProxy({
        jsonData: {
            jsonrpc: '2.0',
            method: 'VideoLibrary.GetTVShows',
            params: {
                properties: [
                    'title', 'sorttitle', 'genre', 'year', 'rating', 'plot', 'studio', 'mpaa', 'playcount',
                    'episode', 'imdbnumber', 'premiered', 'votes', 'lastplayed', 'art', 'file',
                    'watchedepisodes', 'tag'
                ],
                sort: {
                    order: 'ascending',
                    ignorearticle: sortArticles,
                    method: 'sorttitle'
                }
            },
            id: 'WIMM'
        }
    }),
    reader: new Ext.data.JsonReader({ root: 'result.tvshows' }, tvShowRecord)
});

var storeSeason = new Ext.data.Store({
    sortInfo: { field: 'season', direction: 'ASC' },
    proxy: new Ext.data.KodiProxy({
        jsonData: {
            jsonrpc: '2.0',
            method: 'VideoLibrary.GetSeasons',
            params: {
                // tvshowid: -1, // Replaced by valid tv show id before loaded.
                properties: ['season', 'thumbnail']
            },
            id: 'WIMM'
        }
    }),
    reader: new Ext.data.JsonReader({ root: 'result.seasons' }, seasonRecord)
});

var storeEpisode = new Ext.data.Store({
    sortInfo: { field: 'episode', direction: 'ASC' },
    proxy: new Ext.data.KodiProxy({
        jsonData: {
            jsonrpc: '2.0',
            method: 'VideoLibrary.GetEpisodes',
            params: {
                // tvshowid: -1, // Replaced by valid tv show id before loaded.
                // season: -1, // Replaced by valid season id before loaded.
                properties: [
                    'episode', 'title', 'rating', 'plot', 'firstaired',
                    'director', 'streamdetails', 'playcount', 'file', 'writer'
                ]
            },
            id: 'WIMM'
        }
    }),
    reader: new Ext.data.JsonReader({ root: 'result.episodes' }, episodeRecord)
});

var storeActor = new Ext.data.Store({
    sortInfo: { field: 'name', direction: 'ASC' },
    proxy: new Ext.data.KodiProxy({
        jsonData: {
            jsonrpc: '2.0',
            method: 'VideoLibrary.GetTVShowDetails',
            params: {
                // tvshowid: -1, // Replaced by valid tv show id before loaded.
                properties: ['cast']
            },
            id: 'WIMM'
        }
    }),
    reader: new Ext.data.JsonReader({ root: 'result.tvshowdetails.cast' }, actorRecord)
});

var tvshowStars = new Ext.ux.KodiStars ({
    id: 'tvShowStarRating',
    border: 0,
    width: 96,
    height:27
});

var episodeStars = new Ext.ux.KodiStars ({
    id: 'episodeStarRating',
    width: 72,
    height:20
});

var TVShowCover = new Ext.ux.KodiImages({
    id: 'tvshowcover',
    cls: 'center-align',
    border: 0,
    width: 380,
    height:70,
    autoEl: {tag: 'img', src: Ext.BLANK_IMAGE_URL}
});

var SeasonCover = new Ext.ux.KodiImages({
    id: 'seasoncover',
    cls: 'center-align',
    border: 0,
    width: 160,
    height:231,
    autoEl: {tag: 'img', src: Ext.BLANK_IMAGE_URL}
});

var tvShowDetailsPanel = new Ext.FormPanel({
    title: '<div align="center">Select a TV show</div>',
    id: 'tvShowdetailPanel',

    region: 'north',

    frame: true,
    trackResetOnLoad: true,

    items: [
        {
            layout: 'column',
            padding: 5,
            items: [
                {
                    columnWidth:0.70,
                    items: [TVShowCover]
                },
                {
                    columnWidth: 0.30,
                    items: [tvshowStars]
                }
            ]
        },
        {
            layout: 'column',
            items: [
                {
                    columnWidth: 0.40,
                    layout: 'form',
                    labelWidth: 85,
                    padding: '0 10px',
                    defaults: {
                        xtype: 'textfield',
                        width: 200,
                        listeners: {
                            change: function() {
                                Ext.getCmp('savebutton').enable();
                            }
                        }
                    },

                    items: [
                        {
                            fieldLabel: 'Title',
                            name: 'title',
                            allowBlank: false
                        },
                        {
                            fieldLabel: 'Sort Title',
                            name: 'sorttitle'
                        },
                        {
                            fieldLabel: 'Genres',
                            name: 'genre',
                            readOnly: true,
                            id: 'genreString'
                        },
                        {
                            fieldLabel: 'First Aired',
                            name: 'premiered'
                        },
                        {
                            fieldLabel: 'Channel',
                            name: 'studio'
                        },
                        {
                            fieldLabel: 'Content Rating',
                            name: 'mpaa'
                        },
                        {
                            fieldLabel: 'Tags',
                            name: 'tag'
                        }
                    ]
                },
                {
                    xtype:'textarea',
                    fieldLabel: 'Description',
                    name: 'plot',

                    columnWidth: 0.40,
                    height: 175,

                    listeners: {
                        change: function() {
                            Ext.getCmp('savebutton').enable();
                        }
                    }
                }
            ]
        }
    ]
});

var episodeDetailsPanel = new Ext.FormPanel({
    id: 'episodedetailPanel',
    title: '<div align="center">Select an episode</div>',

    region: 'center',

    frame: true,

    layout: 'table',
    layoutConfig: { columns: 2 },
    items:[
        {
            layout: 'form',
            labelWidth: 65,
            padding: '0 10px',
            defaults: {
                xtype: 'textfield',
                width: 400,
                listeners: {
                    change: function() {
                        Ext.getCmp('savebutton').enable();
                    }
                }
            },

            items: [
                {
                    fieldLabel: 'Title',
                    name: 'title',
                    allowBlank: false
                },
                {
                    fieldLabel: 'Aired',
                    name: 'firstaired'
                },
                {
                    fieldLabel: 'Director',
                    name: 'director'
                },
                {
                    fieldLabel: 'Writer',
                    name: 'writer'
                },
                {
                    fieldLabel: 'Rating',
                    name: 'rating'
                },
				{
					fieldLabel: 'Path',
					name: 'path'
                },
                {
                    xtype: 'textarea',
                    fieldLabel: 'Description',
                    name: 'plot',
                    height: 125,
                },
                {
                    xtype: 'button',
                    text: 'Download Episode',
                    handler: function() {
                        var selectedEpisode = Ext.getCmp('episodeGird').getSelectionModel().getSelected(),
                            path = selectedEpisode.data.directory + selectedEpisode.data.file;

                        if (path !== '') {
                            window.open(WIMM.util.convertVFSURL(path), '');
                        }
                    }
                }
            ]
        },
        {
            width: 170,
            items: [episodeStars, SeasonCover]
        },
        {
            xtype: 'panel',
            layout: 'hbox',
            colspan: 2,
            items: [videoFlagsPanel, audioFlagsPanel]
        }

    ]
});

var tvShowGrid = new Ext.grid.GridPanel({
    title: 'TV Shows',
    id: 'tvshowgrid',
    store: storeTVShow,

    flex: 1,
    frame: true,

    cm: new Ext.grid.ColumnModel([
        { header: 'Title', dataIndex: 'title', id: 'title' },
		{ header: '<img src="../resources/images/icons/rating.png" width="16" height="16" alt="Rating">', dataIndex: 'rating', width: 35, renderer: checkRating, tooltip: 'Rating' },
        { header: '<img src="../resources/images/icons/checked.png" width="16" height="16" alt="Watched">',
          dataIndex: 'playcount', width: 30, tooltip: 'Watched', renderer: checkWatched }
    ]),
    autoExpandColumn: 'title',
    enableColumnResize: false,
    stripeRows: true,

    viewConfig: {
        headersDisabled: true
    },

    sm: new Ext.grid.RowSelectionModel({ singleSelect: true })
});

var seasonGrid = new Ext.grid.GridPanel({
    title: 'Seasons',
    id: 'seasonGrid',
    store: storeSeason,

    flex: 1,
    frame: true,

    cm: new Ext.grid.ColumnModel([
        { header: '#', dataIndex: 'season', hidden: true },
        { header: 'Season', dataIndex: 'label', id: 'title' }
    ]),
    autoExpandColumn: 'title',
    enableColumnResize: false,
    hideHeaders: true,
    stripeRows: true,

    viewConfig: {
        headersDisabled: true
    },

    sm: new Ext.grid.RowSelectionModel({ singleSelect: true })
});

var gridContextMenu = new Ext.menu.Menu({
    items: [
        { text: 'Mark as watched', handler: setWatched },
        { text: 'Mark as unwatched', handler: setUnwatched }
    ]
});

var episodeGrid = new Ext.grid.GridPanel({
    title: 'Episodes',
    id: 'episodeGird',
    store: storeEpisode,

    flex: 1,
    frame: true,

    cm: new Ext.grid.ColumnModel([
        { header: '#', dataIndex: 'episode', width: 30 },
        { header: 'Title', dataIndex: 'title', id: 'title' },
        { header: '<img src="../resources/images/icons/checked.png" width="16" height="16" alt="Watched">',
          dataIndex: 'playcount', width: 30, tooltip: 'Watched', renderer: checkWatched }
    ]),
    autoExpandColumn: 'title',
    enableColumnResize: false,
    stripeRows: true,

    viewConfig: {
        headersDisabled: true
    },

    sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
    listeners: {
        rowcontextmenu: function(grid, rowIndex, e) {
            e.stopEvent();
            gridContextMenu.showAt(e.getXY());
        }
    }
});

var actorGrid = new Ext.grid.GridPanel({
    title: 'Cast',
    id: 'actorgrid',
    store: storeActor,

    cm: new Ext.grid.ColumnModel([
        { header: 'Actor', dataIndex: 'name' },
        { header: 'Role', dataIndex: 'role' }
    ]),
    stripeRows: true,

    viewConfig: {
        scrollOffset: 1,
        headersDisabled: true
    }
});

var otherDetailsPanel = new Ext.FormPanel({
    title: 'Other Details',
    id: 'filedetailPanel',

    labelWidth: 55,
    padding: 5,
    defaults: {
        xtype: 'textfield',
        width: 150
    },
    items: [
        {
            fieldLabel: 'Name',
            name: 'file',
            readOnly: true,
        },
        {
            fieldLabel: 'Directory',
            name: 'directory',
            readOnly: true,
        }
    ]
});

TVShow.Mainpanel = new Ext.Panel({
    region: 'center',
    layout: 'border',

    frame: true,
    loadMask: true,

    items: [
        {
            xtype: 'panel',
            region: 'east',
            split: true,
            collapsible: true,
            collapsed: true,
            width: 225,

            items: [{
                layout: 'accordion',
                height: 500,
                items: [
                    Ext.getCmp('genresGrid'),
                    actorGrid,
                    otherDetailsPanel
                ]
            }]
        },
        menuBar,
        {
            xtype : 'panel',
            region: 'west',

            layout: 'hbox',
            layoutConfig: { align: 'stretch' },
            width: 450,

            items: [
                {
                    xtype : 'panel',
                    flex: 1,

                    layout: 'vbox',
                    layoutConfig: { align: 'stretch' },

                    items: [
                        tvShowGrid,
                        seasonGrid
                    ]
                },
                episodeGrid
            ]
        },
        {
            xtype: 'panel',
            region: 'center',
            id: 'mainpanel',
            buttons: [
                {
                    disabled: true,
                    text: 'Save',
                    id: 'savebutton',
                    handler: function(e) {
                        updateKodiAll();
                        this.disable();
                    }
                },
                {
                    text: 'Cancel',
                    handler: function() {
                        // TODO: should this reset the form?
                    }
                }
            ],
            items: [
                tvShowDetailsPanel,
                episodeDetailsPanel
            ]
        }
    ],

    initEvents: function() {
        Ext.getCmp('tvshowgrid').getSelectionModel().on('rowselect', this.tvShowSelect, this);
        Ext.getCmp('seasonGrid').getSelectionModel().on('rowselect', this.seasonSelect, this);
        Ext.getCmp('episodeGird').getSelectionModel().on('rowselect', this.episodeSelect, this);
    },

    tvShowSelect: function(sm, rowIdx, record) {
        var tvShowDetailsPanel = Ext.getCmp('tvShowdetailPanel');
        var episodeDetailsPanel = Ext.getCmp('episodedetailPanel');

        tvShowDetailsPanel.setTitle('<div align="center">' + record.data.title +
            ' (' + record.data.episode + ' Episodes / ' + record.data.watchedepisodes +
            ' Watched)</div>');
        episodeDetailsPanel.setTitle('<div align="center">Select an episode</div>');

        loadTVShowDetails(record);
        updateTVShowGenreGrid(record);
        clearEpisodeDetails();

        storeEpisode.removeAll();
        storeSeason.load({ params: { tvshowid: record.data.tvshowid } });
        storeActor.load({ params: { tvshowid: record.data.tvshowid } });
    },

    seasonSelect: function(sm, rowIdx, record) {
        var selectedTvShow = Ext.getCmp('tvshowgrid').getSelectionModel().getSelected();
        var episodeDetailsPanel = Ext.getCmp('episodedetailPanel');
        var seasonCover = Ext.getCmp('seasoncover');

        clearEpisodeDetails();
        episodeDetailsPanel.setTitle('<div align="center">Season ' + record.data.season +
            ' / Select an episode</div>');
        seasonCover.updateSrc(record.data.thumbnail);

        storeEpisode.load({ params: {
            tvshowid: selectedTvShow.data.tvshowid,
            season: record.data.season
        } });
    },

    episodeSelect: function(sm, rowIdx, record) {
        var selectedSeason = Ext.getCmp('seasonGrid').getSelectionModel().getSelected();
        var episodeDetailsPanel = Ext.getCmp('episodedetailPanel');

        episodeDetailsPanel.setTitle('<div align="center">Season ' + selectedSeason.data.season +
            ' / Episode ' + record.data.episode + '</div>');
        updateEpisodeDetails(record);
    }
});
