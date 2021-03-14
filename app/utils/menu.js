'use strict';


export default class Menu {
  constructor(tree) {
    this._tree = tree;
    this._hashTable = new Map();
    const walk = (lkey, node) => {
      const newObj = {
        key: lkey ? `${lkey}.${node.key}` : node.key,
        title: node.title,
      };
      this._hashTable.set(newObj.key, node);
      const subMenu = node['sub-menu'];
      if (Array.isArray(subMenu)) {
        newObj.children = subMenu.map(item => walk(newObj.key, item));
      }
      return newObj;
    };
    this._displayTree =
      tree.map(node => walk('', node));

    // this._tree = Object.create(null);

    //this._tree = menu.map(node => walk('', node)) //.forEach(([k, v]) => this._tree[k] = v);

    // const walk = (node) => {
    //   const newObj = Object.create(null);
    //   if (Array.isArray(node.children)) {
    //     node.children
    //       .map(child => walk(child))
    //       .forEach(([k, v]) => newObj[k] = v);
    //   };
    //   if (node.perm) {
    //     newObj.__perm = Array.isArray(node.perm) ?
    //       node.perm : [node.perm];
    //   }
    //   return [node.key, newObj];
    // };
    // // 权限树
    // this._permTree = Object.create(null);
    // menu.map(walk).forEach(([k, v]) => this._permTree[k] = v);

    // this._tree = menu;
  }

  // get tree() {

  // }

  // get root() {
  //   return this._menu.root;
  // }

  getDisplayTree(permissions) {
    return this._displayTree;
  }

  // _getNodeChain(lkey) {
  //   const keylist = lkey.split('.');
  //   const nodes = [this.root];
  //   for (const key of keylist) {
  //     const node = nodes[nodes.length - 1];
  //     const child = node.childmap ? node.childmap.get(key) : undefined;
  //     if (!child) {
  //       return [];
  //     }
  //     nodes.push(child);
  //   }
  //   return nodes;
  // }

  // _getNode(lkey) {
  //   const nodes = this._getNodeChain(lkey);
  //   if (nodes.length > 0) {
  //     return nodes[nodes.length - 1];
  //   }
  // }

  // getPermission(lkey) {
  //   if (!Array.isArray(lkey))
  //     lkey = [lkey];

  //   const perms = new Set();
  //   lkey.forEach(item => {
  //     const node = getValue(this._permTree, lkey);
  //     if (!node || !node.__perm)
  //       return;

  //     const perm = node.__perm;
  //     if (Array.isArray(perm)) {
  //       perm.forEach(p => perms.add(p));
  //     } else {
  //       perms.add(perm);
  //     }
  //   });
  //   return Array.from(perms);
  // }

  getPermission(lkey) {
    if (!Array.isArray(lkey)) 
      lkey = [lkey];

    const perms = new Set();
    lkey.forEach(item => {
      const node = this._hashTable.get(item);
      if (!node || !node.perm)
        return;

      const perm = node.perm;
      if (Array.isArray(perm)) {
        perm.forEach(p => perms.add(p));
      } else {
        perms.add(perm);
      }
    });
    return Array.from(perms);
  }

  // getAllPermission(lkey) {
  //   const nodes = this.getNodeChain(lkey);
  //   const perms = new Set();
  //   for (const node of nodes) {
  //     Array.isArray(node.perm) ? 
  //       node.perm.forEach(p => perms.add(p)) : perms.add(node.perm);
  //   }
  //   return Array.from(perms);
  // }
}