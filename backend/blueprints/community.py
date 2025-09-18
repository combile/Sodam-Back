from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Post, Comment, PostLike, CommentLike
from datetime import datetime

community_bp = Blueprint('community', __name__, url_prefix='/api/community')

# 게시글 관련 API
@community_bp.route('/posts', methods=['GET'])
def get_posts():
    """게시글 목록 조회"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        
        query = Post.query
        
        # 카테고리 필터링
        if category:
            query = query.filter(Post.category == category)
        
        # 검색 필터링
        if search:
            query = query.filter(
                (Post.title.contains(search)) | 
                (Post.content.contains(search))
            )
        
        # 최신순 정렬
        posts = query.order_by(Post.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': {
                'posts': [post.to_dict() for post in posts.items],
                'total': posts.total,
                'pages': posts.pages,
                'current_page': page,
                'has_next': posts.has_next,
                'has_prev': posts.has_prev
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """게시글 상세 조회"""
    try:
        post = Post.query.get_or_404(post_id)
        
        # 댓글도 함께 조회
        comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.asc()).all()
        
        return jsonify({
            'success': True,
            'data': {
                'post': post.to_dict(),
                'comments': [comment.to_dict() for comment in comments]
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/posts/<int:post_id>/view', methods=['POST'])
def increment_post_view(post_id):
    """게시글 조회수 증가"""
    try:
        post = Post.query.get_or_404(post_id)
        post.views += 1
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'views': post.views
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    """게시글 작성"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        # 필수 필드 검증
        required_fields = ['category', 'title', 'content']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field}은(는) 필수입니다.'}), 400
        
        # 게시글 생성
        post = Post(
            user_id=user_id,
            category=data['category'],
            title=data['title'],
            content=data['content'],
            business_type=data.get('business_type'),
            location=data.get('location')
        )
        
        db.session.add(post)
        
        # 사용자에게 경험치 추가 (게시글 작성: 50 exp)
        user = User.query.get(user_id)
        if user:
            level_result = user.add_experience(50, "post")
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': '게시글이 작성되었습니다.',
                'data': post.to_dict(),
                'levelUp': level_result
            })
        else:
            db.session.commit()
            return jsonify({
                'success': True,
                'message': '게시글이 작성되었습니다.',
                'data': post.to_dict()
            })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    """게시글 수정"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        post = Post.query.get_or_404(post_id)
        
        # 권한 확인
        if post.user_id != user_id:
            return jsonify({'success': False, 'message': '수정 권한이 없습니다.'}), 403
        
        # 수정할 필드들 업데이트
        if 'title' in data:
            post.title = data['title']
        if 'content' in data:
            post.content = data['content']
        if 'category' in data:
            post.category = data['category']
        if 'business_type' in data:
            post.business_type = data['business_type']
        if 'location' in data:
            post.location = data['location']
        
        post.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '게시글이 수정되었습니다.',
            'data': post.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    """게시글 삭제"""
    try:
        user_id = get_jwt_identity()
        
        post = Post.query.get_or_404(post_id)
        
        # 권한 확인
        if post.user_id != user_id:
            return jsonify({'success': False, 'message': '삭제 권한이 없습니다.'}), 403
        
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '게시글이 삭제되었습니다.'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# 댓글 관련 API
@community_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def create_comment(post_id):
    """댓글 작성"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        if not data.get('content'):
            return jsonify({'success': False, 'message': '댓글 내용은 필수입니다.'}), 400
        
        # 게시글 존재 확인
        post = Post.query.get_or_404(post_id)
        
        # 댓글 생성
        comment = Comment(
            post_id=post_id,
            user_id=user_id,
            content=data['content']
        )
        
        db.session.add(comment)
        
        # 게시글의 댓글 수 증가
        post.comments_count += 1
        
        # 사용자에게 경험치 추가 (댓글 작성: 20 exp)
        user = User.query.get(user_id)
        if user:
            level_result = user.add_experience(20, "comment")
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': '댓글이 작성되었습니다.',
                'data': comment.to_dict(),
                'levelUp': level_result
            })
        else:
            db.session.commit()
            return jsonify({
                'success': True,
                'message': '댓글이 작성되었습니다.',
                'data': comment.to_dict()
            })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/comments/<int:comment_id>', methods=['PUT'])
@jwt_required()
def update_comment(comment_id):
    """댓글 수정"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        comment = Comment.query.get_or_404(comment_id)
        
        # 권한 확인
        if comment.user_id != user_id:
            return jsonify({'success': False, 'message': '수정 권한이 없습니다.'}), 403
        
        if 'content' in data:
            comment.content = data['content']
        
        comment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '댓글이 수정되었습니다.',
            'data': comment.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    """댓글 삭제"""
    try:
        user_id = get_jwt_identity()
        
        comment = Comment.query.get_or_404(comment_id)
        
        # 권한 확인
        if comment.user_id != user_id:
            return jsonify({'success': False, 'message': '삭제 권한이 없습니다.'}), 403
        
        # 게시글의 댓글 수 감소
        post = comment.post
        post.comments_count -= 1
        
        db.session.delete(comment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '댓글이 삭제되었습니다.'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/comments/<int:comment_id>/accept', methods=['POST'])
@jwt_required()
def accept_comment(comment_id):
    """댓글 채택 (답변 채택)"""
    try:
        user_id = get_jwt_identity()
        
        comment = Comment.query.get_or_404(comment_id)
        post = comment.post
        
        # 게시글 작성자만 채택 가능
        if post.user_id != user_id:
            return jsonify({'success': False, 'message': '답변 채택 권한이 없습니다.'}), 403
        
        # 기존 채택된 답변이 있다면 취소
        existing_accepted = Comment.query.filter_by(post_id=post.id, is_accepted=True).first()
        if existing_accepted:
            existing_accepted.is_accepted = False
        
        # 새 답변 채택
        comment.is_accepted = True
        post.is_solved = True
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '답변이 채택되었습니다.',
            'data': comment.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# 좋아요 관련 API
@community_bp.route('/posts/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    """게시글 좋아요/취소"""
    try:
        user_id = get_jwt_identity()
        
        post = Post.query.get_or_404(post_id)
        
        # 이미 좋아요한 경우 취소
        existing_like = PostLike.query.filter_by(post_id=post_id, user_id=user_id).first()
        if existing_like:
            db.session.delete(existing_like)
            post.likes_count -= 1
            message = '좋아요가 취소되었습니다.'
        else:
            # 새 좋아요 추가
            like = PostLike(post_id=post_id, user_id=user_id)
            db.session.add(like)
            post.likes_count += 1
            message = '좋아요가 추가되었습니다.'
            
            # 게시글 작성자에게 경험치 추가 (좋아요 받기: 5 exp)
            post_author = User.query.get(post.user_id)
            if post_author and post_author.id != user_id:  # 자신의 게시글에 좋아요는 제외
                post_author.add_experience(5, "like_received")
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': message,
            'data': {'likes_count': post.likes_count}
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/comments/<int:comment_id>/like', methods=['POST'])
@jwt_required()
def like_comment(comment_id):
    """댓글 좋아요/취소"""
    try:
        user_id = get_jwt_identity()
        
        comment = Comment.query.get_or_404(comment_id)
        
        # 이미 좋아요한 경우 취소
        existing_like = CommentLike.query.filter_by(comment_id=comment_id, user_id=user_id).first()
        if existing_like:
            db.session.delete(existing_like)
            comment.likes_count -= 1
            message = '좋아요가 취소되었습니다.'
        else:
            # 새 좋아요 추가
            like = CommentLike(comment_id=comment_id, user_id=user_id)
            db.session.add(like)
            comment.likes_count += 1
            message = '좋아요가 추가되었습니다.'
            
            # 댓글 작성자에게 경험치 추가 (좋아요 받기: 3 exp)
            comment_author = User.query.get(comment.user_id)
            if comment_author and comment_author.id != user_id:  # 자신의 댓글에 좋아요는 제외
                comment_author.add_experience(3, "like_received")
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': message,
            'data': {'likes_count': comment.likes_count}
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# 사용자별 게시글/댓글 조회
@community_bp.route('/users/<int:user_id>/posts', methods=['GET'])
def get_user_posts(user_id):
    """특정 사용자의 게시글 조회"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        posts = Post.query.filter_by(user_id=user_id).order_by(Post.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': {
                'posts': [post.to_dict() for post in posts.items],
                'total': posts.total,
                'pages': posts.pages,
                'current_page': page
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/users/<int:user_id>/comments', methods=['GET'])
def get_user_comments(user_id):
    """특정 사용자의 댓글 조회"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        comments = Comment.query.filter_by(user_id=user_id).order_by(Comment.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': {
                'comments': [comment.to_dict() for comment in comments.items],
                'total': comments.total,
                'pages': comments.pages,
                'current_page': page
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@community_bp.route('/users/<int:user_id>/answered-posts', methods=['GET'])
def get_user_answered_posts(user_id):
    """특정 사용자가 댓글을 작성한 게시글 조회"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # 사용자가 댓글을 작성한 게시글 ID들을 가져옴
        commented_post_ids = db.session.query(Comment.post_id).filter_by(user_id=user_id).distinct().subquery()
        
        # 해당 게시글들을 조회
        posts = Post.query.filter(Post.id.in_(
            db.session.query(commented_post_ids.c.post_id)
        )).order_by(Post.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': {
                'posts': [post.to_dict() for post in posts.items],
                'total': posts.total,
                'pages': posts.pages,
                'current_page': page,
                'has_next': posts.has_next,
                'has_prev': posts.has_prev
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
